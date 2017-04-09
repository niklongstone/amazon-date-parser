function AmazonDateParser(rawDate) {
    rawDate = (typeof rawDate == 'undefined') ? '' : rawDate;

    var date = new Date(Date.parse(rawDate));
    var result;
    var eventDate = {};
    var res = rawDate.split("-");
    var dates, firstDay, lastDay;

    if (isNaN(date) && rawDate !== null) {
        if (res.length === 2 && res[1].indexOf('W') > -1) {
            dates = getWeekData(res);
            firstDay = new Date(dates.startDate);
            lastDay = new Date(dates.endDate);
        } else if (res.length === 3) {
            dates = getWeekendData(res);
            firstDay = new Date(dates.startDate);
            lastDay = new Date(dates.endDate);
        } else if (res.length === 1  && res[0].indexOf('X') > -1) {
            var partialYear = res[0].substring(0,3);
            var firstYear =  partialYear + 0;
            firstDay = new Date(firstYear);
            var lastYear = partialYear + 9;
            var lastYearDate = new Date(lastYear);
            lastDay = new Date(lastYearDate.getFullYear(), lastYearDate.getMonth() + 12, 0);
        } else {
            if (rawDate === 'PRESENT_REF') {
                var now = Date(Date.now());

                return {
                    startDate: new Date(now),
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
}

module.exports = AmazonDateParser;
