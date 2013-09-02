var assert = require('chai').assert,
    check = require('validator').check,
    Checker = require('./index').Checker;

describe('obj-validator', function() {

    it('simple check', function() {
        var user = Checker({
            'id': Checker.isInt()
        });

        user({
            'id': 4
        });

        assert.
        throw (function() {
            user({
                'id': 'id'
            });
        });
    });

    it('check with msg', function() {
        var user = Checker({
            'id': Checker.msg('Id is not int').isInt()
        });

        assert.
        throw (function() {
            user({
                'id': 'id'
            });
        }, "Id is not int");
    });

    it('chain check', function() {
        var user = Checker({
            'id': Checker.isInt(),
            'email': Checker.len(6, 64).isEmail()
        });

        user({
            'id': 5,
            'email': 'test@email.com'
        });

        assert.
        throw (function() {
            user({
                'id': 5,
                'email': 'a@b.c'
            });
        });

        assert.
        throw (function() {
            user({
                'id': 5,
                'email': 'myemail.email.com'
            });
        });
    });


    it('chain check with msg', function() {
        var foo = Checker({
            'foo': Checker.msg({
                isNumeric: 'This is not a number',
                gst
                contains: "The value doesn't have a 0 in it"
            }).isNumeric().contains('0')
        });

        foo({
            'foo': 40
        });

        assert.
        throw (function() {
            foo({
                'foo': 'fo0o'
            });
        }, 'This is not a number');

        assert.
        throw (function() {
            foo({
                'foo': 13
            });
        }, "The value doesn't have a 0 in it");
    });


    it('nested check', function() {
        var user = Checker({
            'id': Checker.msg('Id is not int').isInt(),
            'profile': {
                'name': Checker.isAlpha(),
                'email': Checker.len(6, 60).isEmail(),
            }
        });

        user({
            'id': 43,
            'profile': {
                'name': 'dfasd',
                'email': 'test@email.com'
            }
        });

        assert.
        throw (function() {
            user({
                'id': 43
            });
        }, 'Candidate is undfined or null');

        assert.
        throw (function() {
            user({
                'id': 43,
                'profile': {
                    'name': 'afadsf43',
                    'email': 't@d.c'
                }
            });
        }, 'Invalid character');

        assert.
        throw (function() {
            user({
                'id': 43,
                'profile': {
                    'name': 'adfa',
                    'email': 't@d.c'
                }
            });
        }, 'String is not in range');
    });
});