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

    return function(obj) {
        for (var key in rules) {
            if (rules.hasOwnProperty(key)) {
                applyRule(rules[key], obj[key]);
            }
        }
    };
};

Checker.msg = function(msg) {
    return new Rule(msg);
};

// ===================
// Rule 
// ===================

function Rule(msg) {
    this.msg = msg;
    this.checks = [];
}

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

// ===================
// Helpers
// ===================

function applyRule(rule, val) {
    if (rule instanceof Rule) {
        var checks = rule.checks,
            v = check(val, rule.msg);

        for (var i = 0, len = checks.length; i < len; ++i) {
            v[checks[i][0]].apply(v, checks[i][1]);
        }
    } else if (isPlainObject(rule)) {
        for (var field in rule) {
            if (rule.hasOwnProperty(field)) {
                if (val === undefined || val === null)
                    throw new Error('Candidate is undfined or null');
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
            if (!rule instanceof Rule) {
                if (!isPlainObject(rule)) {
                    throw new Error('rules are not appoporiate.');
                }
                validateRule(rule);
            }
        }
    }
}