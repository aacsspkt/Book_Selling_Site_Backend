const validator = require('validator');

const RegisterInput = (data) => {
    let errors = {};

    if (data.username) {
        if (!validator.isLength(data.username.trim(), { min: 6, max: 30 })) {
            errors.username = 'Username must be between 6 and 30 characters.';
        }
    } else errors.username = 'Username is required.';

    if (data.password) {
        if (!validator.isLength(data.password.trim(), { min: 6, max: 30 })) {
            errors.password = 'Password must be between 6 and 30 characters.';
        }
    } else errors.password = 'Password is required.';

    if (data.email) {
        if (!validator.isLength(data.email.trim(), { min: 5 })) {
            errors.password = 'Email cannot be less than 5 characters.';
        }
    } else errors.password = 'Email is required.';


    return {
        errors,
        isValid: Object.keys(errors).length === 0
    }
}

module.exports = {
    RegisterInput
}