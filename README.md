# Object Validator

Object Validator help you to build validating function to validate a JSON Object easily. based on [node-validator](https://github.com/chriso/node-validator)

<!--- travis ci -->
[![Build Status](https://travis-ci.org/villadora/node-obj-validator.png?branch=master)](https://travis-ci.org/villadora/node-obj-validator)

## Installation

Install with npm:

    npm install obj-validator --save


## Example

    var Checker = require('obj-validator').Checker,
        validate;

    validate = Checker({
        'id': Checker.isInt(),
        'username': Checker.isUppercase()
    });
 
    // string message for check
    validate = Checker({
        'id': Checker.msg('Id is not int').isInt()
    });
    
    // given message
    validate = Checker({
        'foo': Checker.msg({
            isNumeric: 'This is not a number',
            contains: "The value doesn't have a 0 in it"
        }).isNumeric().contains('0')
    });

    // nested checker, with nested Checker
    validate = Checker({
        'id': Checker.msg('Id is not int').isInt(),
        'profile': Checker({
            'name': Checker.isAlpha(),
            'email': Checker.len(6, 60).isEmail(),
        }).error(function() { throw new Error('Invalid profile'); })
    });
    

    // nested checker, with nested objects
    validate = Checker({
        'id': Checker.msg('Id is not int').isInt(),
        'profile': {
            'name': Checker.isAlpha(),
            'email': Checker.len(6, 60).isEmail(),
        }
    });
    
    // custom error handler
    validate = Checker({
        'id': Checker.isInt().error(function(msg) { console.log(msg); }), // the same as validator
        'profile': Checker({
            ...
        }).onerror(function(/* message */ msg, /* property name */ key, /* original error */original) { throw new Error('Invalid profile'); })
    }).onerror(function(msg, key, err) {...});

    
    try {
        validate(candidate)
    }catch(e) {
        console.log(e.message);
    }


## Validation methods

The validation methods is the same as [node-validator](https://github.com/chriso/node-validator).

### Additional methods

* ```isOptional(ignoreFalseValue)```: which mark this property checking is optional and no needed if the property is not existing in candidate
* ``` error(fn)```: add error handler

## Changelog

* 0.0.6: 'isOptional' method now accepts argument `ignoreFalseValue`, which indicates whether the checker accept false values like 0, "", null, etc.
* 0.0.5: add 'isOptional' and make nested object checker better; allow custom error handlers
* 0.0.4: expose check api in 'validator' for convinient
* 0.0.3: make internal Rule callable
* 0.0.2: nothing valuable
* 0.0.1: start 

## License

(The BSD License)

Copyright (c) 2013, Villa.Gao <jky239@gmail.com>;
All rights reserved.
