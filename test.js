import test from 'ava';
import getPackageCodeDebt from './index.js'

getPackageCodeDebt.log = 'warning'

var x = getPackageCodeDebt("./example_packages/calculator")
var listOfFiles = Object.keys(x.files)


test('Test the number of dependices', t => {
    t.true(x.files[listOfFiles[1]].debts === 1);
});


test('Test the number of dependices', t => {
    t.true(x.files[listOfFiles[1]].comments === 2);
});


test('Test the ratio of the debt of the overall package', t => {
    t.true(x.percentage === 0.3333333333333333);
});
