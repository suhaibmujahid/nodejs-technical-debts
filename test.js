import test from 'ava';
import getPackageCodeDebt from './index.js'


var x = getPackageCodeDebt('./example_packages/calculator')
var listOfFiles = Object.keys(x.files)

test('Test the results for `index.js`', t => {
    t.deepEqual(x.files[listOfFiles[0]] , { debts: 0, comments: 0 })
})

test('Test the results for `lib/addition.js`', t => {
    t.deepEqual(x.files[listOfFiles[1]] , { debts: 1, comments: 2 })
})

test('Test the results for `lib/division.js`', t => {
    t.deepEqual(x.files[listOfFiles[2]] , { debts: 2, comments: 7 })
})

test('Test the results for `lib/multiplication.js`', t => {
    t.deepEqual(x.files[listOfFiles[3]] , { debts: 0, comments: 1 })
})

test('Test the results for `lib/subtraction.js`', t => {
    t.deepEqual(x.files[listOfFiles[4]] , { debts: 1, comments: 2 })
})


test('Test the number of debts', t => {
    t.true(x.debts === 4)
})

test('Test the number of comments', t => {
    t.true(x.comments === 12)
})

test('Test the ratio of the debt of the overall package', t => {
    t.true(x.percentage === 0.3333333333333333)
})
