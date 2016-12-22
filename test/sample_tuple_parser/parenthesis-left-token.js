var ParserToken = require('parser.token')

function ParenthesisLeftToken (token) {
    ParserToken.call(this, token, [
        'START_EXPR',
        'ARGUMENT_TUPLE'
    ], next)
}

ParenthesisLeftToken.prototype = Object.create(ParserToken.prototype)
ParenthesisLeftToken.prototype.constructor = ParenthesisLeftToken

function next (status) {
    this.parserStatus.push(status === 'START_EXPR' ? 'END_EXPR' : 'SEPARATOR_TUPLE')
    return 'ARGUMENT_TUPLE'
}

module.exports = ParenthesisLeftToken
