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

    static logOut() {
        sessionStorage.clear();
        // Redirect
        window.location.href = FRONTEND_URL;
    }

    static getRefreshFeed() {
        return Boolean(Number(sessionStorage.getItem("refreshFeed")));
    }

    static setRefreshFeed(newActivity:boolean){
        sessionStorage.setItem("refreshFeed", String(Number(newActivity)));
    }
}
