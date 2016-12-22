var ParserToken = require('parser.token')

function CommaToken (token) {
    ParserToken.call(this, token, [
        'SEPARATOR_TUPLE'
    ], next)
}

CommaToken.prototype = Object.create(ParserToken.prototype)
CommaToken.prototype.constructor = CommaToken

function next () {
    return 'ARGUMENT_TUPLE'
}

module.exports = CommaToken
