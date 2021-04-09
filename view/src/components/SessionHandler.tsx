export default class SessionHandler {
    getAuthToken = () => {
        return "Bearer " + sessionStorage.getItem("AccessToken");
    }

    isLoggedIn = () => {
        console.log(sessionStorage.getItem("AccessToken"));
        return sessionStorage.getItem("AccessToken") !== null;
    }

    getUser = () => {
        return ({
            username: sessionStorage.getItem("username")
        });
    }
}