function ParserGenerator (lexerIterator, parserTokenClasses, parserStatus) {
    if (!(this instanceof ParserGenerator)) {
        return new ParserGenerator(lexerIterator, parserTokenClasses, parserStatus)
    }
    this.parserTokenClasses = parserTokenClasses
    this.iterator = lexerIterator
    this.parserStatus = parserStatus
}

ParserGenerator.prototype.next = function () {
    var token = nextToken(this)
    var status
    if (token) {
        status = doNextStatus(this.parserStatus, token)
    }
    var done = !status
    return {
        value: done ? undefined : this.parserStatus.getArray()[0],
        done: done
    }
}

function nextToken (parserIterator) {
    var it = parserIterator.iterator.next()
    parserIterator.done = it.done
    parserIterator.token = it.value
    var rawToken = parserIterator.token || {}
    var ParserTokenConstr = parserIterator.parserTokenClasses[rawToken.type]
    if (ParserTokenConstr) {
        var token = new ParserTokenConstr(rawToken)
        return token
    } else if (rawToken.type) {
        throw new Error('`' + rawToken.type + '` is not a parser token type')
    }
}

function doNextStatus (parserStatus, token) {
    var status = parserStatus.getStatus()
    var array = parserStatus.getArray()
    token.bind(parserStatus)
    return token.next(status, array, function (nextStatus) {
        parserStatus.setStatus(nextStatus)
        return nextStatus
    })
}

module.exports = ParserGenerator
