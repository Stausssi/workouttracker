/*
/ class for all regex validations
 */

export class RegexValidator{
    static validateEmail(email: string) {
        // email regex
        return /^[^@]+@\w+(\.\w+)+\w$/.test(email);
    }

    static validatePassword(password: string) {
        // regex for: min 8 letter password, with at least a symbol, upper and lower case letters and a number
        return /^(?=.*\d)(?=.*[!@#$%^&_*-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);
    }

    static validateUsername(username: string){
        // regex: 20 alphanumeric characters and "_" / "-"
        return /^([\w_-]{1,20})$/.test(username);
    }

    static validateName(name: string){
        // regex: 30 alphanumeric characters and "-, ä, ö, ü"
        return /^([A-Za-z-äöü]{1,30})$/.test(name);
    }
}