# Amazon Date parser
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![Build Status](https://img.shields.io/travis/niklongstone/amazon-date-parser/master.svg?style=flat-square)](https://travis-ci.org/niklongstone/amazon-date-parser)

Given an [AMAZON.DATE](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/built-in-intent-ref/slot-type-reference#date) returns an object with the relative start and end date.

## Installation
`npm install amazon-date-parser`

## Usage
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
It throws an error in case of invalid constructor parameter or parameter not supported.
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
single day: 2015-11-24
week: 2015-W48
weekend: 2015-W48-WE
month: 2015-11
year: 2016
decade: 201X

## RoadMap
The next release will have support for:
winter: 2017-WI
spring: 2017-SP
summer: 2017-SU
autumn/fall: 2017-FA


## Credits

- [Nicola Pietroluongo](https://github.com/niklongstone)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
