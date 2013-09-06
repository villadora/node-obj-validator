var validator = require('validator'),
check = validator.check,
validators = validator.validators,
Validator = validator.Validator;

// ===================
// Validator Extend
// ===================
// Validator.prototype.or = function() {
//     this.error = function(msg) {
//         this._errors.push(msg);
//     };
//     return this;
// };

// ===================
// Checker
// ===================

/** 
 * @param {Object} rules
 * @return {function}
 *
 * @example
 * var rules = {
 *     'id': Rule.is(/[a-z]+/),
 *     'email': Rule.len(4, 64).isEmail()
 * };
 */

var Checker = function(rules) {
    var rules = rules || {};
    validateRule(rules);

    function checker(obj) {
        if(checker.optional && typeof obj === 'undefined')
            return;

        /* jshint eqnull: true */
        if(obj == null) {
            if(checker.onerror)
                checker.onerror(checker.__msg || 'Candidate is undefined or null');
            else
                throw new Error(checker.__msg || 'Candidate is undefined or null');
        }

        for (var key in checker.rules) {
            try { 
                if (checker.rules.hasOwnProperty(key)) {
                    applyRule(checker.rules[key], obj[key]);
                }
            }catch(e) {
                if(checker.onerror) checker.onerror(e.message, key, e);
                else {
                    e.key = key;
                    throw e;
                }
            }
        }
    }

    checker.rules = rules;

    checker.msg = function(msg) {
        this.__msg = msg;
        return this;
    };

    checker.isOptional = function() {
        this.optional = true;
        return this;
    };

    checker.error = function(onerror) {
        this.onerror = onerror;
        return this;
    };

    return checker;
};


Checker.msg = function(msg) {
    return new Rule(msg);
};

Checker.isOptional = function() {
    return new Rule(undefined, true);
};

// ===================
// Rule 
// ===================

function Rule(msg, optional, onerror) {
    this.__msg = msg;
    this.optional = optional;
    this.onerror = onerror;
    this.checks = [];
}



Rule.prototype.isOptional = function() {
    this.optional = true;
    return this;
};

Rule.prototype.msg = function(msg) {
    this.__msg = msg;
    return this;
};

Rule.prototype.error = function(onerror) {
    this.onerror = onerror;
    return this;
};


Rule.prototype.__exec__ = function(obj) {
    if(this.optional && typeof obj === 'undefined')
        return;

    var checks = this.checks,
        v = check(obj, this.__msg);

    if(this.onerror) v.error = this.onerror;

    for (var i = 0, len = checks.length; i < len; ++i) {
        v[checks[i][0]].apply(v, checks[i][1]);
    }
};



for (var key in validators) {
    if (validators.hasOwnProperty(key)) {
        (function(key) {
            Rule.prototype[key] =
                Checker[key] =
                function() {
                    var host = this;
                    if (this === Checker) {
                        host = new Rule();
                    }

                    host.checks.push([key, arguments]);
                    return host;
                };
        })(key);
    }
}



module.exports.Checker = Checker;

// exports node-validator api
module.exports.check = check;
module.exports.sanitize = validator.sanitize;

// ===================
// Helpers
// ===================

function applyRule(rule, val) {
    if (rule instanceof Rule) {
        rule.__exec__(val);
    }else if (rule instanceof Function) {
        rule(val);
    } else if (isPlainObject(rule)) {
        for (var field in rule) {
            if (rule.hasOwnProperty(field)) {
                if (val === undefined || val === null)
                    throw new Error('Candidate is undefined or null');
                applyRule(rule[field], val[field]);
            }
        }
    }
}


function isPlainObject(obj) {
    if (typeof obj == 'function')
        return false;
    try {
        if (obj.constructor && !Object.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
            return false;
        }
    } catch (e) {
        return false;
    }
    return true;
}


function validateRule(rules) {
    for (var key in rules) {
        if (rules.hasOwnProperty(key)) {
            var rule = rules[key];
            if (!(rule instanceof Rule || rule instanceof Function)) {
                if (!isPlainObject(rule)) {
                    throw new Error('rules are not appoporiate.');
                }
                validateRule(rule);
            }
        }
    }
}
