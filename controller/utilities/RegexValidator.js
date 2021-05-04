/*
/ functions for all regex validations
 */

 exports.validateEmail = (email) => {
    // email regex
    return /^[^@]+@\w+(\.\w+)+\w$/.test(email);
}

 exports.validatePassword = (password) => {
    // regex for: min 8 letter password, with at least a symbol, upper and lower case letters and a number
    return /^(?=.*\d)(?=.*[!@#$%^&_*-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);
}

 exports.validateUsername = (username) => {
    // regex: 20 alphanumeric characters and "_" / "-"
    return /^([\w_-]{1,20})$/.test(username);
}

exports.validateName = (name) => {
    // regex: 30 alphanumeric characters and "-, ä, ö, ü"
    return /^([A-Za-z-äöü]{1,30})$/.test(name);
}

