function AmazonDateParser(rawDate, options) {
    rawDate = (typeof rawDate == 'undefined') ? '' : rawDate;

    var date = new Date(Date.parse(rawDate));
    var result;
    var eventDate = {};
    var res = rawDate.split("-");
    var dates, firstDay, lastDay, season;
    var meteoSeasonsNorthHemisphere = {
        'SP': {
            startDate: [2, 1],  // 1st of March
            endDate: [5, 0]     // 31st of May
        },
        'SU': {
            startDate: [5, 1],  // 1st of June
            endDate: [8, 0]     // 31st of August
        },
        'FA': {
            startDate: [8, 1],  // 1st of September
            endDate: [11, 0]    // 30th of November
        },
        'WI': {
            startDate: [11, 1], // 1st of December
            endDate: [2, 0]     // end of February (28th or 29th)
        }
    };

    if (typeof options === 'undefined') {
        options = { seasons: meteoSeasonsNorthHemisphere };
    } else {
        if (typeof options.seasonType === 'undefined') {
            options.seasonType = 'METEO';
        }
        if (typeof options.hemisphere === 'undefined') {
            options.hemisphere = 'N';
        }
        if (typeof options.seasons === 'undefined') {
            options.seasons = meteoSeasonsNorthHemisphere;
            if (options.hemisphere === 'S') {
                options.seasons = southHemisphereTranslation(meteoSeasonsNorthHemisphere);
            }
        }
    }

    if (isNaN(date) && rawDate !== null) {
        if (res.length === 2 && (res[1] === 'SP' || res[1] === 'SU' || res[1] === 'FA' || res[1] === 'WI')) {
            season = res[1];
            eventDate.startDate = new Date(Date.UTC(res[0], options.seasons[season].startDate[0], options.seasons[season].startDate[1], 0, 0, 0, 0));
            eventDate.endDate  = new Date(res[0], options.seasons[season].endDate[0], options.seasons[season].endDate[1], 23, 59, 59, 999);
            if (options.seasons[season].endDate[0] === 2 && options.seasons[season].endDate[1] === 0) {
                eventDate.endDate  = new Date(Date.UTC(parseInt(res[0]) + 1, options.seasons[season].endDate[0], options.seasons[season].endDate[1], 23, 59, 59, 999));
            }

            return eventDate;
        } else if (res.length === 2 && res[1].indexOf('W') > -1) {
            dates = getWeekData(res);
            firstDay = new Date(dates.startDate);
            lastDay = new Date(dates.endDate);
        } else if (res.length === 3) {
            dates = getWeekendData(res);
            firstDay = new Date(dates.startDate);
            lastDay = new Date(dates.endDate);
        } else if (res.length === 1  && res[0].indexOf('X') > -1) {
            var partialYear = res[0].substring(0,3);
            firstDay = new Date(partialYear + 0);
            lastDay = Date.UTC(partialYear + 9, 12, 0);
        } else {
            if (rawDate === 'PRESENT_REF') {
                var now = new Date(Date.now());

                return {
                    startDate: now,
                    endDate: now
                };
            } else {
                throw new Error('Invalid constructor parameter or parameter not supported.');
            }
        }
    } else {
        if (res.length === 3) {
            firstDay = lastDay = date;
        } else if (res.length === 2) {
            firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        } else {
            firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            lastDay = new Date(date.getFullYear(), date.getMonth() + 12, 0);
        }
    }
    var startDate = new Date(firstDay).setUTCHours(0, 0, 0, 0);
    var endDate = new Date(lastDay).setUTCHours(23, 59, 59, 999);
    eventDate.startDate = new Date(startDate);
    eventDate.endDate = new Date(endDate);

    return eventDate;
}

function getWeekendData(res) {
    if (res.length === 3) {
        var saturdayIndex = 5;
        var sundayIndex = 6;
        var weekNumber = res[1].substring(1);
        var weekStart = w2date(res[0], weekNumber, saturdayIndex);
        var weekEnd = w2date(res[0], weekNumber, sundayIndex);

        return {
            startDate: weekStart,
            endDate: weekEnd,
        };
    }
}

function getWeekData(res) {
    if (res.length === 2) {
        var mondayIndex = 0;
        var sundayIndex = 6;
        var weekNumber = res[1].substring(1);
        var weekStart = w2date(res[0], weekNumber, mondayIndex);
        var weekEnd = w2date(res[0], weekNumber, sundayIndex);

        return {
            startDate: weekStart,
            endDate: weekEnd,
        };
    }
}

function w2date(year, wn, dayNb) {
    var day = 86400000;
    var j10 = new Date(year, 0, 10, 12, 0, 0),
        j4 = new Date(year, 0, 4, 12, 0, 0),
        mon1 = j4.getTime() - j10.getDay() * day;

    return new Date(mon1 + ((wn - 1) * 7 + dayNb) * day);
}

function southHemisphereTranslation(meteoSeasonsNorthHemisphere) {
    return {
        'SP': meteoSeasonsNorthHemisphere.FA,
        'SU': meteoSeasonsNorthHemisphere.WI,
        'FA': meteoSeasonsNorthHemisphere.SP,
        'WI': meteoSeasonsNorthHemisphere.SU
    };
}

module.exports = AmazonDateParser;
