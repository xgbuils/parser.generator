var ParserToken = require('parser.token')

function NumberToken (token) {
    ParserToken.call(this, token, [
        'ARGUMENT_TUPLE'
    ], next)
}

NumberToken.prototype = Object.create(ParserToken.prototype)
NumberToken.prototype.constructor = NumberToken

function next () {
    var parserStatus = this.parserStatus
    parserStatus.addValue(this.value)
    return 'SEPARATOR_TUPLE'
}

module.exports = NumberToken
