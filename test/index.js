var assert = require('assert');
var AmazonDateParser = require('../index');

describe('AmazonDateParser', function() {

    describe('constructor', function() {

        it('should throw an error if the constructor parameter is not provided', function() {
          assert.throws(function(){new AmazonDateParser()}, Error);
        });

        it('should return a correct date range given a "right now" date', function() {
            const rawDate = 'PRESENT_REF';
            var now = new Date(Date.now());
            var expected = new Date(now.getFullYear(), now.getMonth(), now.getDay(), now.getHours(), now.getMinutes());

            var date = new AmazonDateParser(rawDate);

            var resDate = new Date(date.startDate.getFullYear(), date.startDate.getMonth(), date.startDate.getDay(), date.startDate.getHours(), date.startDate.getMinutes());

            assert.equal(date.startDate, date.endDate, 'startDate and endDate are not equal');
            //does not compare seconds because can fail during a slow test execution.
            assert.equal(resDate.toString(), expected.toString());
        });

        it('should return a correct date range given a single day', function() {
            const rawDate = '2017-01-30';
            var startDate = new Date(rawDate).setUTCHours(0,0,0,0);
            var endDate = new Date(rawDate).setUTCHours(23, 59, 59, 999);
            expected = {
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            };

            var date = new AmazonDateParser(rawDate);

            assert.equal(JSON.stringify(date), JSON.stringify(expected));
        });


        it('should return a correct date range given a week', function() {
            const rawDate = '2017-W13'; //March 27, 2017 to April 2, 2017
            var startDate = new Date('2017-03-27');
            var endDate = new Date('2017-04-02').setUTCHours(23, 59, 59, 999);
            expected = {
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            };

            var date = new AmazonDateParser(rawDate);

            assert.equal(JSON.stringify(date), JSON.stringify(expected));
        });

        it('should return a correct date range given a weekend', function() {
            const rawDate = '2017-W13-WE'; // April 1, 2017 to April 2, 2017
            var startDate = new Date('2017-04-01');
            var endDate = new Date('2017-04-02').setUTCHours(23, 59, 59, 999);
            expected = {
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            };

            var date = new AmazonDateParser(rawDate);

            assert.equal(JSON.stringify(date), JSON.stringify(expected));
        });

        it('should return a correct date range given a month', function() {
            const rawDate = '2017-01';
            var startDate = new Date(rawDate + '-01').setUTCHours(0,0,0,0);
            var endDate = new Date(rawDate + '-31').setUTCHours(23, 59, 59, 999);
            expected = {
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            };

            var date = new AmazonDateParser(rawDate);

            assert.equal(JSON.stringify(date), JSON.stringify(expected));
        });

        it('should return a correct date range given a year', function() {
            const rawDate = '2017';
            var startDate = new Date(rawDate + '-01-01').setUTCHours(0,0,0,0);
            var endDate = new Date(rawDate + '-12-31').setUTCHours(23, 59, 59, 999);
            expected = {
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            };

            var date = new AmazonDateParser(rawDate);

            assert.equal(JSON.stringify(date), JSON.stringify(expected));
        });

        it('should return a correct date range given a decade', function() {
            const rawDate = '201X'; // 2010 to 2019
            var startDate = new Date('2010-01-01');
            var endDate = new Date('2019-12-31').setUTCHours(23, 59, 59, 999);
            expected = {
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            };

            var date = new AmazonDateParser(rawDate);

            assert.equal(JSON.stringify(date), JSON.stringify(expected));
        });

    });

});
