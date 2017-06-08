var assert = require('assert');
var AmazonDateParser = require('../index');

describe('AmazonDateParser', function() {

    describe('constructor', function() {

        it('should throw an error if the constructor parameter is not provided', function() {
          assert.throws(function(){new AmazonDateParser();}, Error);
        });

        it('should return a correct date range given a "right now" date', function() {
            var rawDate = 'PRESENT_REF';
            var now = new Date(Date.now());
            var expected = new Date(now.getFullYear(), now.getMonth(), now.getDay(), now.getHours(), now.getMinutes());

            var date = new AmazonDateParser(rawDate);

            var resDate = new Date(date.startDate.getFullYear(), date.startDate.getMonth(), date.startDate.getDay(), date.startDate.getHours(), date.startDate.getMinutes());

            assert.deepEqual(date.startDate, date.endDate, 'startDate and endDate are not equal');
            //does not compare seconds because can fail during a slow test execution.
            assert.equal(resDate.toString(), expected.toString());
        });

        it('should return a correct date range given a single day', function() {
            var rawDate = '2017-01-30';
            var startDate = new Date(rawDate).setUTCHours(0,0,0,0);
            var endDate = new Date(rawDate).setUTCHours(23, 59, 59, 999);

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });


        it('should return a correct date range given a week', function() {
            var rawDate = '2017-W13'; //March 27, 2017 to April 2, 2017
            var startDate = new Date('2017-03-27');
            var endDate = new Date('2017-04-02').setUTCHours(23, 59, 59, 999);

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a weekend', function() {
            var rawDate = '2017-W13-WE'; // April 1, 2017 to April 2, 2017
            var startDate = new Date('2017-04-01');
            var endDate = new Date('2017-04-02').setUTCHours(23, 59, 59, 999);
            expected = {
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            };

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a month', function() {
            var rawDate = '2017-01';
            var startDate = new Date(rawDate + '-01').setUTCHours(0,0,0,0);
            var endDate = new Date(rawDate + '-31').setUTCHours(23, 59, 59, 999);

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a spring season', function() {
            var rawDate = '2017-SP'; // 1st of March to 31st of May
            var startDate = Date.UTC(2017, 2, 1);
            var endDate = new Date(2017, 5, 0, 23, 59, 59, 999);

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a summer season', function() {
            var rawDate = '2017-SU'; // 1st of June to 31st of August
            var startDate = Date.UTC(2017, 5, 1);
            var endDate = new Date(2017, 8, 0, 23, 59, 59, 999);

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a fall season', function() {
            var rawDate = '2017-FA'; // 1st of September to 30th of November
            var startDate = Date.UTC(2017, 8, 1);
            var endDate = new Date(2017, 11, 0, 23, 59, 59, 999);

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a winter season', function() {
            var rawDate = '2017-WI'; // 1st of December to end of February 28th
            var startDate = Date.UTC(2017, 11, 1);
            var endDate = new Date(2018, 2, 0, 23, 59, 59, 999);

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a winter season on a leap year', function() {
            var rawDate = '2019-WI'; // 1st of December to end of February 29th
            var startDate = Date.UTC(2019, 11, 1);
            var endDate = new Date(2020, 2, 0, 23, 59, 59, 999);

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a winter on south hemisphere', function() {
            var rawDate = '2017-WI'; // 1st of June to 31st of August
            var startDate = Date.UTC(2017, 5, 1);
            var endDate = new Date(2017, 8, 0, 23, 59, 59, 999);

            var date = new AmazonDateParser(rawDate, {hemisphere: 'S'});

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a spring on south hemisphere', function() {
            var rawDate = '2017-SP'; // 1st of September to 30th of November
            var startDate = Date.UTC(2017, 8, 1);
            var endDate = new Date(2017, 11, 0, 23, 59, 59, 999);

            var date = new AmazonDateParser(rawDate, {hemisphere: 'S'});

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a summer on south hemisphere', function() {
            var rawDate = '2017-SU'; // 1st of December to end of February 28th
            var startDate = Date.UTC(2017, 11, 1);
            var endDate = new Date(2018, 2, 0, 23, 59, 59, 999);

            var date = new AmazonDateParser(rawDate, {hemisphere: 'S'});

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a fall on south hemisphere', function() {
            var rawDate = '2017-FA'; // 1st of March to 31st of May
            var startDate = Date.UTC(2017, 2, 1);
            var endDate = new Date(2017, 5, 0, 23, 59, 59, 999);

            var date = new AmazonDateParser(rawDate, {hemisphere: 'S'});

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a custom seasons options', function() {
            var rawDate = '2017-SU';
            var options = {
                'seasons':{
                    'SU': {
                        startDate: [0, 1],
                        endDate: [1, 2]
                    }
                }
            };
            var startDate = Date.UTC(2017, 0, 1);
            var endDate = new Date(2017, 1, 2, 23, 59, 59, 999);

            var date = new AmazonDateParser(rawDate, options);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range ignoring the hemisphere option when the seasons one is present', function() {
            var rawDate = '2018-SU';
            var options = {
                'seasons':{
                    'SP': {
                        startDate: [1, 0],  // 1st of March
                        endDate: [1, 1]     // 31st of May
                    },
                    'SU': {
                        startDate: [5, 0],  // 1st of June
                        endDate: [5, 1]     // 31st of August
                    },
                    'FA': {
                        startDate: [8, 0],  // 1st of September
                        endDate: [8, 1]    // 30th of November
                    },
                    'WI': {
                        startDate: [10, 0], // 1st of December
                        endDate: [10, 1]     // end of February (28th or 29th)
                    },
                'hemisphere': 'S'
                }
            };
            var startDate = Date.UTC(2018, 5, 0);
            var endDate = new Date(2018, 5, 1, 23, 59, 59, 999);

            var date = new AmazonDateParser(rawDate, options);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a year', function() {
            var rawDate = '2017';
            var startDate = new Date(rawDate + '-01-01').setUTCHours(0,0,0,0);
            var endDate = new Date(rawDate + '-12-31').setUTCHours(23, 59, 59, 999);
            expected = {
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            };

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expected);
        });

        it('should return a correct date range given a decade', function() {
            var rawDate = '201X'; // 2010 to 2019
            var startDate = new Date('2010-01-01');
            var endDate = new Date('2019-12-31').setUTCHours(23, 59, 59, 999);

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

    });

    function expectedJSON(startDate, endDate) {
        return {
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        };
    }

});
