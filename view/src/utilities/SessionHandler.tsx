import {FRONTEND_URL} from "../App";

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

    static getUsername() {
        return sessionStorage.getItem("username");
    }

    static logOut() {
        sessionStorage.clear();
        // Redirect
        window.location.href = FRONTEND_URL;
    }

    static getRefreshFeed(isOwnFeed: boolean = true) {
        let key = "refresh" + (isOwnFeed ? "Own" : "Friends") + "Feed";
        return Boolean(Number(sessionStorage.getItem(key)));
    }

    static setRefreshFeed(refresh: boolean, isOwnFeed: boolean = true) {
        let key = "refresh" + (isOwnFeed ? "Own" : "Friends") + "Feed";
        sessionStorage.setItem(key, String(Number(refresh)));
    }
}
