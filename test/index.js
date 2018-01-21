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
            var splitDate = rawDate.split("-");
            var startDate = createStartDate(splitDate[0], splitDate[1], splitDate[2]);
            var endDate = createEndDate(splitDate[0], splitDate[1], splitDate[2]);

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a week', function() {
            var rawDate = '2017-W13'; //March 27 to April 2, 2017
            var startDate = createStartDate(2017, 3, 27);
            var endDate = createEndDate(2017, 4, 2);

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a weekend', function() {
            var rawDate = '2017-W13-WE'; // April 1, 2017 to April 2, 2017
            var startDate = createStartDate(2017, 4, 1);
            var endDate = createEndDate(2017, 4, 2);

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a month', function() {
            var rawDate = '2017-01';
            var startDate = createStartDate(2017, 1, 1);
            var endDate = createEndDate(2017, 1, 31);

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a spring season', function() {
            var rawDate = '2017-SP'; // 1st of March to 31st of May
            var startDate = createStartDate(2017, 3, 1);
            var endDate = createEndDate(2017, 5, 31);

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a summer season', function() {
            var rawDate = '2017-SU'; // 1st of June to 31st of August
            var startDate = createStartDate(2017, 6, 1);
            var endDate = createEndDate(2017, 8, 31);

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a fall season', function() {
            var rawDate = '2017-FA'; // 1st of September to 30th of November
            var startDate = createStartDate(2017, 9, 1);
            var endDate = createEndDate(2017, 11, 30);

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a winter season', function() {
            var rawDate = '2017-WI'; // 1st of December to end of February 28th
            var startDate = createStartDate(2017, 12, 1);
            var endDate = createEndDate(2018, 2, 28);

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a winter season on a leap year', function() {
            var rawDate = '2019-WI'; // 1st of December to end of February 29th
            var startDate = createStartDate(2019, 12, 1);
            var endDate = createEndDate(2020, 2, 29);

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a winter on south hemisphere', function() {
            var rawDate = '2017-WI'; // 1st of June to 31st of August
            var startDate = createStartDate(2017, 6, 1);
            var endDate = createEndDate(2017, 8, 31);

            var date = new AmazonDateParser(rawDate, {hemisphere: 'S'});

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a spring on south hemisphere', function() {
            var rawDate = '2017-SP'; // 1st of September to 30th of November
            var startDate = createStartDate(2017, 9, 1);
            var endDate = createEndDate(2017, 11, 30);

            var date = new AmazonDateParser(rawDate, {hemisphere: 'S'});

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a summer on south hemisphere', function() {
            var rawDate = '2017-SU'; // 1st of December to end of February 28th
            var startDate = createStartDate(2017, 12, 1);
            var endDate = createEndDate(2018, 2, 28);

            var date = new AmazonDateParser(rawDate, {hemisphere: 'S'});

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a fall on south hemisphere', function() {
            var rawDate = '2017-FA'; // 1st of March to 31st of May
            var startDate = createStartDate(2017, 3, 1);
            var endDate = createEndDate(2017, 5, 31);

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
            var startDate = new Date(2017, 0, 1);
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
            var startDate = new Date(2018, 5, 0);
            var endDate = new Date(2018, 5, 1, 23, 59, 59, 999);

            var date = new AmazonDateParser(rawDate, options);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a year', function() {
            var rawDate = '2017';
            var startDate = createStartDate(2017, 1, 1);
            var endDate = createEndDate(2017, 12, 31);

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a decade', function() {
            var rawDate = '201X'; // 2010 to 2019
            var startDate = createStartDate(2010, 1, 1);
            var endDate = createEndDate(2019, 12, 31);

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a 1st quarter', function() {
            var rawDate = '2018-Q1';
            var startDate = createStartDate(2018, 1, 1);
            var endDate = createEndDate(2018, 3, 31);

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a 2nd quarter', function() {
            var rawDate = '2018-Q2';
            var startDate = createStartDate(2018, 4, 1);
            var endDate = createEndDate(2018, 6, 30);

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a 3rd quarter', function() {
            var rawDate = '2018-Q3';
            var startDate = createStartDate(2018, 7, 1);
            var endDate = createEndDate(2018, 9, 30);

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

        it('should return a correct date range given a 4th quarter', function() {
            var rawDate = '2018-Q4';
            var startDate = createStartDate(2018, 10, 1);
            var endDate = createEndDate(2018, 12, 31);

            var date = new AmazonDateParser(rawDate);

            assert.deepEqual(date, expectedJSON(startDate, endDate));
        });

    });

    function createStartDate(y, m, g) {
      return new Date(y, m-1, g, 0, 0, 0, 0);
    }

    function createEndDate(y, m, g) {
      return new Date(y, m-1, g, 23, 59, 59, 999);
    }

    function expectedJSON(startDate, endDate) {
        return {
            startDate: startDate,
            endDate: endDate
        };
    }
});
