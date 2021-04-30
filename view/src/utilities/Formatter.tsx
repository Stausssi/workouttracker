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

    // Create a m or km string depending on the size of the number
    static format_MeterKilometer(numberInM: number) {
        if (numberInM < 1000) {
            return numberInM + " m";
        } else {
            return (numberInM / 1000).toFixed(1) + " km";
        }
    }

    static format_ActivityDuration(durationInS: number) {
        const DurInM = Math.round(durationInS / 60);

        if (DurInM < 60) {
            return Formatter.fillZeros(DurInM) + ":" + Formatter.fillZeros(durationInS % 60) + " min";
        } else {
            let DurInH = Math.round(DurInM / 60);
            if (DurInH < 24) {
                return Formatter.fillZeros(DurInH) + ":" + Formatter.fillZeros(DurInM % 60) + " hours";
            } else {
                let diffInD = Math.round(DurInH / 24);
                return diffInD + " days " + (DurInH % 24 === 0 ? "" : DurInH % 24 + " hours");
            }
        }
    }

    static format_pace(kmPerHour: number) {
        return (kmPerHour).toFixed(1) + " km/h";
    }

    static format_heartRate(heartRate: number) {
        return heartRate + " bpm";
    }
}