var ParserToken = require('parser.token')

function EndToken (token) {
    ParserToken.call(this, token, [
        'END_EXPR'
    ], next)
}

EndToken.prototype = Object.create(ParserToken.prototype)
EndToken.prototype.constructor = EndToken

function next () {
}

module.exports = EndToken
