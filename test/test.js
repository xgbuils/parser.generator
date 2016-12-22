var chai = require('chai')
var expect = chai.expect

var Iterum = require('iterum')
var List = Iterum.List

var ParserToken = require('parser.token')
var ParenthesisLeftToken = require('./sample_tuple_parser/parenthesis-left-token')
var NumberToken = require('./sample_tuple_parser/number-token.js')
var CommaToken = require('./sample_tuple_parser/comma-token.js')
var ParenthesisRightToken = require('./sample_tuple_parser/parenthesis-right-token')
var EndToken = require('./sample_tuple_parser/end-token')

var parserStatus = require('parser.status')
var parser = require('./sample_tuple_parser/parser')

var parserGenerator = require('../src/')

var ParserTokenError = ParserToken.error.ParserTokenError

var parserTokenClasses = {
    'number': NumberToken,
    '(': ParenthesisLeftToken,
    ')': ParenthesisRightToken,
    ',': CommaToken,
    'end': EndToken
}

function createToken (value, type, column, key) {
    return {
        value: value,
        type: type,
        column: column,
        key: key
    }
}

function createEndToken (column) {
    return {
        type: 'end',
        key: '<<END OF LINE>>',
        column: column
    }
}

describe('testing parserGenerator using parser of tuples', function () {
    describe('valid expressions', function () {
        describe('given 1-tuple', function () {
            it('returns the correct tuple', function () {
                var num = 2

                // (2)
                var lex = List([
                    createToken('(', '('),
                    createToken(num, 'number'),
                    createToken(')', ')'),
                    createEndToken()
                ])
                var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))
                var result = parser(parserIterator)
                expect(result).to.be.deep.equal([num])
            })
        })

        describe('given 2-tuple', function () {
            it('returns the correct tuple', function () {
                var a = 12
                var b = 31

                // (12, 31)
                var lex = List([
                    createToken('(', '('),
                    createToken(a, 'number'),
                    createToken(',', ','),
                    createToken(b, 'number'),
                    createToken(')', ')'),
                    createEndToken()
                ])
                var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))
                var result = parser(parserIterator)
                expect(result).to.be.deep.equal([a, b])
            })
        })

        describe('given 2-deep tuple', function () {
            it('returns the correct tuple', function () {
                var a = 1
                var b = 2
                var c = 3
                var d = 4

                // ((1, 2), (3, 4))
                var lex = List([
                    createToken('(', '('),
                    createToken('(', '('),
                    createToken(a, 'number'),
                    createToken(',', ','),
                    createToken(b, 'number'),
                    createToken(')', ')'),
                    createToken(',', ','),
                    createToken('(', '('),
                    createToken(c, 'number'),
                    createToken(',', ','),
                    createToken(d, 'number'),
                    createToken(')', ')'),
                    createToken(')', ')'),
                    createEndToken()
                ])
                var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))
                var result = parser(parserIterator)
                expect(result).to.be.deep.equal([
                    [a, b],
                    [c, d]
                ])
            })
        })

        describe('given 3-deep tuple', function () {
            it('returns the correct tuple', function () {
                var a = 1
                var b = 2
                var c = 3
                var d = 4

                // (1, (2, (3, (4)))
                var lex = List([
                    createToken('(', '('),
                    createToken('(', '('),
                    createToken('(', '('),
                    createToken(a, 'number'),
                    createToken(',', ','),
                    createToken(b, 'number'),
                    createToken(')', ')'),
                    createToken(',', ','),
                    createToken(c, 'number'),
                    createToken(')', ')'),
                    createToken(',', ','),
                    createToken(d, 'number'),
                    createToken(')', ')'),
                    createEndToken()
                ])
                var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))
                var result = parser(parserIterator)
                expect(result).to.be.deep.equal([[[a, b], c], d])
            })
        })

        describe('given 4-deep tuple', function () {
            it('returns the correct tuple', function () {
                var a = 1
                var b = 2
                var c = 3
                var d = 4

                // (1, (2, (3, (4)))
                var lex = List([
                    createToken('(', '('),
                    createToken(a, 'number'),
                    createToken(',', ','),
                    createToken('(', '('),
                    createToken(b, 'number'),
                    createToken(',', ','),
                    createToken('(', '('),
                    createToken(c, 'number'),
                    createToken(',', ','),
                    createToken('(', '('),
                    createToken(d, 'number'),
                    createToken(')', ')'),
                    createToken(')', ')'),
                    createToken(')', ')'),
                    createToken(')', ')'),
                    createEndToken()
                ])
                var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))
                var result = parser(parserIterator)
                expect(result).to.be.deep.equal([a, [b, [c, [d]]]])
            })
        })
    })

    describe('invalid expressions', function () {
        describe('given only a left parenthesis', function () {
            it('throws an error', function () {
                // (
                var lex = List([
                    createToken('(', '('),
                    createEndToken()
                ])
                var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))

                function test () {
                    parser(parserIterator)
                }

                expect(test).to.throw(ParserTokenError)
            })
        })

        describe('given only a right parenthesis', function () {
            it('throws an error', function () {
                // (
                var lex = List([
                    createToken(')', ')'),
                    createEndToken()
                ])
                var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))

                function test () {
                    parser(parserIterator)
                }

                expect(test).to.throw(ParserTokenError)
            })
        })

        describe('given only a comma', function () {
            it('throws an error', function () {
                // ,
                var lex = List([
                    createToken(',', ','),
                    createEndToken()
                ])
                var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))

                function test () {
                    parser(parserIterator)
                }

                expect(test).to.throw(ParserTokenError)
            })
        })

        describe('given only a comma', function () {
            it('throws an error', function () {
                // 6
                var lex = List([
                    createToken(6, 'number'),
                    createEndToken()
                ])
                var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))

                function test () {
                    parser(parserIterator)
                }

                expect(test).to.throw(ParserTokenError)
            })
        })

        describe('given no tokens', function () {
            it('throws an error', function () {
                //
                var lex = List([
                    createEndToken()
                ])
                var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))

                function test () {
                    parser(parserIterator)
                }

                expect(test).to.throw(ParserTokenError)
            })
        })

        describe('given tuple without number', function () {
            it('throws an error', function () {
                // ()
                var lex = List([
                    createToken('(', '('),
                    createToken(')', ')'),
                    createEndToken()
                ])
                var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))

                function test () {
                    parser(parserIterator)
                }

                expect(test).to.throw(ParserTokenError)
            })
        })

        describe('given erroneous expression', function () {
            it('throws an error', function () {
                // (5)(0)
                var lex = List([
                    createToken('(', '('),
                    createToken(5, 'number'),
                    createToken(')', ')'),
                    createToken('(', '('),
                    createToken(0, 'number'),
                    createToken(')', ')'),
                    createEndToken()
                ])
                var parserIterator = parserGenerator(lex.build(), parserTokenClasses, parserStatus('START_EXPR'))

                function test () {
                    parser(parserIterator)
                }

                expect(test).to.throw(ParserTokenError)
            })
        })
    })
})
