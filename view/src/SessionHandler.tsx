export default class SessionHandler {
    static getAuthToken() {
        return "Bearer " + sessionStorage.getItem("AccessToken");
    }

    static isLoggedIn() {
        return sessionStorage.getItem("AccessToken") !== null;
    }

    static isNotLoggedIn() {
        return sessionStorage.getItem("AccessToken") === null;
    }

    static getUser() {
        return ({
            username: sessionStorage.getItem("username")
        });
    }

    static logOut() {
        sessionStorage.clear();
    }
}
