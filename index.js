function AmazonDateParser(rawDate, options) {
    rawDate = (typeof rawDate == 'undefined') ? '' : rawDate;

    var date = new Date(rawDate);
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
            eventDate.startDate = new Date(new Date(res[0], options.seasons[season].startDate[0], options.seasons[season].startDate[1], 0, 0, 0, 0));
            eventDate.endDate  = new Date(res[0], options.seasons[season].endDate[0], options.seasons[season].endDate[1], 23, 59, 59, 999);
            if (options.seasons[season].endDate[0] === 2 && options.seasons[season].endDate[1] === 0) {
                eventDate.endDate  = new Date(new Date(parseInt(res[0]) + 1, options.seasons[season].endDate[0], options.seasons[season].endDate[1], 23, 59, 59, 999));
            }

            return eventDate;
        } else if (res.length === 2 && res[1].indexOf('W') > -1) {
            firstDay = getFirstDayOfWeek(res[0], parseInt(res[1].substr(1)));
            var sevenDaysInMinutes = 10079; //six days and 23 hours
            lastDay = new Date(firstDay.getTime() + (sevenDaysInMinutes*60000));
            lastDay.setSeconds(59);
            lastDay.setMilliseconds(999);

            return outputDates(firstDay, lastDay);
        } else if (res.length === 3) {
            return getWeekendData(res);
        } else if (res.length === 1  && res[0].indexOf('X') > -1) {
            var partialYear = res[0].substring(0,3);
            firstDay = new Date(partialYear + 0, 0, 1, 0, 0, 0);
            lastDay = new Date(partialYear + 9, 12, 0, 23, 59, 59, 999);

            return outputDates(firstDay, lastDay);
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
            firstDay = new Date(res[0], res[1] -1, res[2], 0, 0, 0);
            lastDay = new Date(res[0], res[1] -1, res[2], 23, 59, 59, 999);

            return outputDates(firstDay, lastDay);
        } else if (res.length === 2) {
            firstDay = new Date(res[0], res[1] -1);
            lastDay = new Date(res[0], res[1], 0, 23, 59, 59, 999);

            return outputDates(firstDay, lastDay);
        } else {
            firstDay = new Date(res[0], 0, 1, 0, 0, 0);
            lastDay = new Date(res[0], 11, 31, 23, 59, 59, 999);

            return outputDates(firstDay, lastDay);
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
        var weekNumber = parseInt(res[1].substring(1));
        var firstDayOfWeek = getFirstDayOfWeek(res[0], weekNumber);
        var weekendStart, weekendEnd;

        firstDayOfWeek.setHours((5 * 24));
        weekendStart = firstDayOfWeek;
        weekendEnd = new Date(firstDayOfWeek);
        weekendEnd.setHours((2 * 24) - 1);
        weekendEnd.setMinutes(59);
        weekendEnd.setSeconds(59);
        weekendEnd.setMilliseconds(999);

        return {
            startDate: weekendStart,
            endDate: weekendEnd,
        };
    }
}

function getFirstDayOfWeek(year, week) {
    var date = new Date(year, 0, 1);
    var offset = date.getTimezoneOffset();
    date.setDate(date.getDate() + 4 - (date.getDay() || 7));
    date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000 * (week + (year == date.getFullYear() ? -1 : 0 )));
    date.setTime(date.getTime() + (date.getTimezoneOffset() - offset) * 60 * 1000);
    date.setDate(date.getDate() - 3);

    return date;
}

function southHemisphereTranslation(meteoSeasonsNorthHemisphere) {
    return {
        'SP': meteoSeasonsNorthHemisphere.FA,
        'SU': meteoSeasonsNorthHemisphere.WI,
        'FA': meteoSeasonsNorthHemisphere.SP,
        'WI': meteoSeasonsNorthHemisphere.SU
    };
}

function outputDates(start, end) {
    return {
        startDate: start,
        endDate: end
    };
}

module.exports = AmazonDateParser;
