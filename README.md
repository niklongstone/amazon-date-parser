# Amazon Date parser
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![Build Status](https://img.shields.io/travis/niklongstone/amazon-date-parser/master.svg?style=flat-square)](https://travis-ci.org/niklongstone/amazon-date-parser)

Given an [AMAZON.DATE](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/built-in-intent-ref/slot-type-reference#date) returns an object with the relative start and end date.

## Installation
`npm install amazon-date-parser`

## Basic usage
```
var AmazonDateParser = require('amazon-date-parser');

var date = new AmazonDateParser('2017-01-31');

/*
returns:
{
    startDate: Tue Jan 31 2017 00:00:00 GMT+0000 (GMT),
    endDate: Tue Jan 31 2017 23:59:59 GMT+0000 (GMT)
}
*/

```
It throws an error when the date is not valid or not supported.
```
var AmazonDateParser = require('amazon-date-parser');

try {
    var date = new AmazonDateParser('dummy');    
}catch(e) {
    console.log(e.message);
}

// Error: Invalid constructor parameter or parameter not supported.
```

## Input values:
* single day: `2017-11-24`
* week: `2017-W48`
* weekend: `2017-W48-WE`
* month: `2017-11`
* quarter: `2018-Q2`
* seasons: `2017-SP`, `2017-WI`, `2017-FA`, `2017-SU` (see below)
* year: `2018`
* decade: `201X`

## Seasons
The constructor receives the following __optional__ parameters only valid for season's calculations.
```
{
    hemisphere: 'N',    //`N` for North, `S` for the South hemisphere (default is `N`)
    seasons: { // see Custom seasons for more info about this parameter
        // ...
        'SU': { // summer
            startDate: [5, 1],  // 1st of June
            endDate: [8, 0]     // 31st of August
        }
        // ...
    }
}
```
The `seasons` parameters overrides all the others. For instance, if you provide `seasons` and `hemisphere` the latter will be ignored.

### Default seasons
The north hemisphere seasons are by default defined as follow:
 * Spring, from the 1st of March to the 31st of May
 * Summer, from the 1st of June to the 31st of August
 * Fall/Autumn, from the 1st of September to the 30th of November
 * Winter, from the 1st of December to the end of February (28th or 29th depending on leap year)

For the south hemisphere you should construct the Amazon date parser as follow:  
`var date = new AmazonDateParser({hemisphere: 'S'});`  
and you can get:  
* Spring, from the 1st of September to the 30th of November
* Summer, from the 1st of December to the end of February (28th or 29th depending on leap year)
* Fall/Autumn, from the 1st of March to the 31st of May
* Winter, from the 1st of June to the 31st of August

### Custom seasons
You can pass your own seasons representation using the following configurations:
```
var options = {
    seasons: {
        'SP': {
            startDate: [2, 1],  // 1st of March
            endDate: [3, 0]     // end of March
        },
        'SU': {
            startDate: [5, 1],  // 1st of June
            endDate: [8, 0]     // end of August
        },
        'FA': {
            startDate: [8, 1],  // 1st of September
            endDate: [11, 0]    // end of November
        },
        'WI': {
            startDate: [11, 1], // 1st of December
            endDate: [2, 0]     // end of February (28th or 29th)
        }
}
var AmazonDateParser = require('amazon-date-parser');

var date = new AmazonDateParser('2018-SP', options);
/*
returns something like:
{
    startDate: Thu Mar 01 2018 00:00:00 GMT+0000 (GMT),
    endDate: Sat Mar 31 2018 23:59:59 GMT+0000 (GMT)
}
*/
```

## Credits

- [Nicola Pietroluongo](https://github.com/niklongstone)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
