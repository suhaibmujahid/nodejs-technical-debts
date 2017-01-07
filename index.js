'use strict';

const path = require('path');
const fs = require('fs')
const log = require('npmlog')
const patterns_list = require('satd-patterns')
module.exports = detectTechnicalDebts

function detectTechnicalDebts(pkg_path) {
    log.info('detectTechnicalDebts', pkg_path)

    var main_file_path = require.resolve(pkg_path)

    var result = {}
    result.files = {}
    result.comments = 0
    result.debts = 0
    var file_queue = [main_file_path]
    var file_path

    for (var i = 0; i < file_queue.length; i++) {
        file_path = file_queue[i]

        if (typeof result[file_path] === 'undefined') {
            var file = getFileContent(file_path)
            var deps = getFileLocalDepList(file, file_path)
            var debt = getCodeDebtFromFile(file)


            file_queue = file_queue.concat(deps)

            result.files[file_path] = debt
            result.comments += debt.comments
            result.debts += debt.debts
        }
    }
    result.percentage = (result.debts/result.comments)
    log.silly('getPackageCodeDebt', result)
    return result
}

function getFileContent(file_path) {
    log.silly('getFileContent', file_path)

    try {
        var file = fs.readFileSync(file_path, {encoding: 'utf8'})
    } catch (e) {
        log.warn('Cannot read the code file', e.message)
        return ''
    }

    return file;
}

function getFileLocalDepList(file, file_path) {
    log.silly('getFileLocalDepList', file_path)

    const regex = /require\(.(\.|\/)(.*?).\)/g
    var deps = file.match(regex)

    if (!deps) return []

    var result = [];
    deps.forEach(function (dep) {
        dep = dep.substring(9, dep.length - 2)
        var dir = path.dirname(file_path)
        var dep_path = require.resolve(dir+'/'+ dep)
        result.push(dep_path)
    })
    log.silly('getFileLocalDepList', result)
    return result
}

function getCodeDebtFromFile(file) {
    log.silly('getCodeDebtFromFile', 'start')

    var result = {}
    result.debts = 0

    var comments = getComments(file)
    result.comments = comments.length
    comments.forEach(findCodeDebt)

    function getComments(string_file) {
        const regex = /\/\/(.*)|\/\*(\*(?!\/)|[^*])*\*\//g
        comments = string_file.match(regex)
        return comments ? comments : []
    }

    function findCodeDebt(comment) {
        const regex = new RegExp(patterns_list.join('|'),'i')
        var debts = comment.match(regex)
        if (debts) result.debts++
    }

    log.silly('getCodeDebtFromFile', result)

    return result
}