var assert = require('chai').assert,
    check = require('validator').check,
    Checker = require('./index').Checker;

describe('obj-validator', function() {
    it('api check', function() {
        assert(require('./index').check);
        assert(require('./index').sanitize);
    });

    it('custom error handler on rule', function(done){
        var user = Checker({
            id: Checker.isInt().error(function(msg) {
                done();
            })
        });
        
        user({});
    });


    it('custom error hendlaer on Checker', function() {
        var user = Checker({
            id: Checker.isInt(),
            name: Checker.isAlpha()
        });
        
        user.error(function(msg, key, err) {
            assert.equal(msg, 'Invalid integer');
            assert.equal(key, 'id');
        });

        user({id:'3a',name:'adfads'});

        user.error(function(msg, key, err) {
            assert.equal(msg, 'Invalid characters');
            assert.equal(key, 'name');
        });
        
        user({id:4, name:'f3f@'});
    });

    it('optional', function(){
        var user = Checker({
            id: Checker.isOptional().isInt()
        });
        
        user({});

        user = Checker({
            id: Checker.isInt().isOptional()
        });

        user({});

        assert.throw(function() {
            user();
        },'Candidate is undefined or null');

        user = Checker({
            id: Checker.isInt().isOptional()
        }).isOptional();

        user();
    });


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
        }, 'Candidate is undefined or null');

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

    it('custom function checker', function(){
        var user = Checker({
            'id': Checker.isInt(),
            'name': function(val) {
                if(/^namespace/.test(val)) return;
                throw new Error('Invalid name');
            }
        });
        
        user({
            id: 43, 
            name: 'namespace.user'
        });

        assert.throw(function() {
            user({
                id: 43, 
                name: 'user hello'
            });
        }, 'Invalid name');
    });


    it('nested rule checker with custom error handler', function() {
        var user = Checker({
            'id': Checker.msg('Id is not int').isInt(),
            'profile': Checker({
                'name': Checker.isAlpha(),
                'email': Checker.len(6, 60).isEmail(),
            }).error(function() { throw new Error('Invalid profile'); })
        });

        assert.throw(function() {
            user({ id: 43});
        }, 'Invalid profile');
    });

    it('nested rule checker', function() {
        var user = Checker({
            'id': Checker.msg('Id is not int').isInt(),
            'profile': Checker({
                'name': Checker.isAlpha(),
                'email': Checker.len(6, 60).isEmail(),
            })
        });

        assert.
        throw (function() {
            user({
                'id': 43
            });
        }, 'Candidate is undefined or null');

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

        assert.
        throw (function() {
            user({
                'id': 43,
                'profile': {
                    'name': 'afadsfdd',
                    'email': 'tdfasdf'
                }
            });
        }, 'Invalid email');
    });
});
