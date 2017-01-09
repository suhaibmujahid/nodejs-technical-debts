# Detect Self-Admitted Technical Debts in NodeJS Packeges [![Build Status](https://travis-ci.org/suhaibtamimi/nodejs-technical-debts.svg?branch=master)](https://travis-ci.org/suhaibtamimi/nodejs-technical-debts) [![Coverage Status](https://coveralls.io/repos/github/suhaibtamimi/nodejs-technical-debts/badge.svg?branch=master)](https://coveralls.io/github/suhaibtamimi/nodejs-technical-debts?branch=master) [![Build status](https://ci.appveyor.com/api/projects/status/94rkrcvga3r89t25?svg=true)](https://ci.appveyor.com/project/suhaibtamimi/nodejs-technical-debts)

Technical debt refers to incomplete or temporary workarounds that allow us to speed software development in the short term at the cost of paying a higher price later on. Recently, studies have shown that technical debt can be detected from source code comments, referred to as self-admitted technical debt.


## Install

```
$ npm install --save technical-debts
```


```js
const detectTechnicalDebts = require('technical-debts');

console.log(detectTechnicalDebts('./example_packages/calculator'));
//{ files:
//   { '... index.js': { debts: 0, comments: 0 },
//     '... lib/addition.js': { debts: 1, comments: 2 },
//     '... lib/division.js': { debts: 2, comments: 7 },
//     '... lib/multiplication.js': { debts: 0, comments: 1 },
//     '... lib/subtraction.js': { debts: 1, comments: 2 } },
//  comments: 12,
//  debts: 4,
//  percentage: 0.3333333333333333 }
```


## Related Publication

- [`An Exploratory Study on Self-Admitted Technical Debt`](http://das.encs.concordia.ca/uploads/2016/01/Potdar_ICSME2014.pdf)


## License

MIT © [Suhaib Mujahid](https://github.com/suhaibtamimi/nodejs-technical-debts)