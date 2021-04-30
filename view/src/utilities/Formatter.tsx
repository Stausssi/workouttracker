export class Formatter {
    // Fill leading zero on a given number
    static fillZeros(number: number | string) {
        return number < 10 ? "0" + number : number;
    }

    /*
     * Format a date into on of the following
     * - 'Just now': Comment posted less than a minute ago
     * - 'x minute(s) ago': Comment posted x minute(s) ago, same for hour(s) and day(s)
     * - 'DD.MM.YYYY': Longer than 2 weeks ago
     */
    static formatCommentDate(timestamp: Date) {
        let formattedTime = "";

        // Calculate difference in minutes
        let diffInM = Math.round((new Date().getTime() - timestamp.getTime()) / 1000 / 60);

        if (diffInM === 0) {
            return "Just now";
        } else if (diffInM < 60) {
            formattedTime = diffInM + " minute" + (diffInM === 1 ? "" : "s");
        } else {
            // Calculate difference in hours
            let diffInH = Math.round(diffInM / 60);
            if (diffInH < 24) {
                formattedTime = diffInH + " hour" + (diffInH === 1 ? "" : "s");
            } else {
                // Calculate difference in days
                let diffInD = Math.round(diffInH / 24);
                if (diffInD < 15) {
                    formattedTime = diffInD + " day" + (diffInD === 1 ? "" : "s");
                } else {
                    // Return date representation
                    return Formatter.fillZeros(timestamp.getDay()) + "." + Formatter.fillZeros(timestamp.getMonth()) + "." + timestamp.getUTCFullYear();
                }
            }
        }

        return formattedTime + " ago";
    }
}