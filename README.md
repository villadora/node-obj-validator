# Object Validator

Object Validator help you to build validating function to validate a JSON Object easily. based on [node-validator](https://github.com/chriso/node-validator)

<!--- travis ci -->
[![Build Status](https://travis-ci.org/villadora/node-obj-validator?branch=master)](https://travis-ci.org/villadora/node-obj-validator)

## Installation

Install with npm:

    npm install obj-validator --save


## Example

    var Checker = require('obj-validator').Checker,
        validate;

    validate = Checker({
        'id': Checker.isInt(),
        'username': Checker
    });

    validate = Checker({
        'id': Checker.msg('Id is not int').isInt()
    });

    validate = Checker({
        'foo': Checker.msg({
            isNumeric: 'This is not a number',
            contains: "The value doesn't have a 0 in it"
        }).isNumeric().contains('0')
    });

    validate = Checker({
        'id': Checker.msg('Id is not int').isInt(),
        'profile': {
            'name': Checker.isAlpha(),
            'email': Checker.len(6, 60).isEmail(),
        }
    });

    try {
        validate(candidate)
    }catch(e) {
        console.log(e.message);
    }

## Validation methods

The validation methods is the same as [node-validator](https://github.com/chriso/node-validator).

## License

(The BSD License)

Copyright (c) 2013, Villa.Gao <jky239@gmail.com>;
All rights reserved.