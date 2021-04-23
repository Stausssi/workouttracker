exports.isParamMissing = (listOfParams) => {
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
    if (error) {
        console.log(error);
        res.sendStatus(500);
    } else {
        res.sendStatus(successCode);
    }
}