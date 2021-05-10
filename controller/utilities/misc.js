exports.isParamMissing = (listOfParams) => {
    // Check for every given param if it exists
    for (let index in listOfParams) {
        if (listOfParams.hasOwnProperty(index)) {
            if (!listOfParams[index]) {
                return true;
            }
        }
    }
    return false;
}

exports.basicSuccessErrorHandling = (error, res, successCode = 201) => {
    // Log error if it exists or return a success code
    if (error) {
        console.log(error);
        res.sendStatus(500);
    } else {
        res.sendStatus(successCode);
    }
}

exports.BACKEND_URL = "https://workouttracker.server-welt.com:9000/backend/"

exports.FRONTEND_URL = "https://workouttracker.server-welt.com/"