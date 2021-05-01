const sql = require("../createConnection");

const Sport = function (sport) {
    this.name = sport.name;
}

Sport.getAll = (setSports) => {
    sql.query("SELECT * FROM sport;",
        function (error, result) {
            if (error) {
                setSports(error, null);
            } else {
                // Convert into useable dict
                let sports = {};
                Object.values(JSON.parse(JSON.stringify(result))).forEach((item) => {
                    let sport = item.sport;
                    let bitfield = item.BitfieldValues;
                    let bitfieldMust = item.BitfieldMustBeSet;

                    sports = Object.assign({}, sports, {[sport]: [bitfield, bitfieldMust]});
                })

                setSports(null, sports);
            }
        });
}

module.exports = Sport;