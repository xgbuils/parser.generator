var ParserToken = require('parser.token')

function ParenthesisRightToken (token) {
    ParserToken.call(this, token, [
        'SEPARATOR_TUPLE'
    ], next)
}

ParenthesisRightToken.prototype = Object.create(ParserToken.prototype)
ParenthesisRightToken.prototype.constructor = ParenthesisRightToken

function next (status, values) {
    var parserStatus = this.parserStatus
    parserStatus.pop()
    parserStatus.addValue(values)
    return parserStatus.getStatus()
}

module.exports = ParenthesisRightToken
