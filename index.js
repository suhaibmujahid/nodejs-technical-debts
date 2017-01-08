'use strict';

const path = require('path');
const fs = require('fs')
const log = require('npmlog')
const patterns_list = require('satd-patterns')
const findMainFile = require('./find-main-file.js')

module.exports = detectTechnicalDebts
log.pause()

var file_queue = []

function detectTechnicalDebts(pkg_path) {
    log.info('detectTechnicalDebts', 'Start for:', pkg_path)

    var result = {}
    result.files = {}
    result.comments = 0
    result.debts = 0
    result.percentage = 0

    try {
        var main_file_path = findMainFile(pkg_path)
        log.silly('findPackageMainFile', main_file_path)
    } catch (e) {
        log.warn('findPackageMainFile', e.message)
        return result
    }

    file_queue = [main_file_path]
    var file_path

    for (var i = 0; i < file_queue.length; i++) {
        file_path = file_queue[i]


        const file = getFileContent(file_path)

        if (file) {
            const deps = getFileLocalDepList(file, file_path)
            const debt = getCodeDebtFromFile(file)
            file_queue = file_queue.concat(deps)

            result.files[file_path] = debt
            result.comments += debt.comments
            result.debts += debt.debts
        }

    }
    result.percentage = result.debts / result.comments || 0

    log.silly('detectTechnicalDebts', 'Result', result)

    return result
}

function getFileContent(file_path) {
    log.silly('getFileContent', 'File path:', file_path)

    try {
        var file = fs.readFileSync(file_path, {encoding: 'utf8'})
    } catch (e) {
        log.warn('getFileContent', e.message)
        return false
    }

    return file;
}

function getFileLocalDepList(file, file_path) {
    log.silly('getFileLocalDepList', 'File path:', file_path)

    const regex = /require\(('|")(\.\.\/|\/|\.\/)([^'"]*?)('|")\)/g
    const deps = file.match(regex)

    if (!deps) return []

    var result = [];
    deps.forEach(function (dep) {
        dep = dep.substring(9, dep.length - 2)
        const dir = path.dirname(file_path)

        try {
            const dep_path = require.resolve(dir + '/' + dep)
            if (file_queue.indexOf(dep_path) == -1) {
                result.push(dep_path)
            }
        } catch (e) {
            log.warn('getFileLocalDepList', e.message)
        }
    })

    log.silly('getFileLocalDepList', result)

    return result
}

function getCodeDebtFromFile(file) {
    log.silly('getCodeDebtFromFile', 'start')

    var result = {}
    result.debts = 0

    const comments_list = getComments(file)
    result.comments = comments_list.length
    comments_list.forEach(findCodeDebt)

    function getComments(string_file) {
        const regex = /\/\/(.*)|\/\*(\*(?!\/)|[^*])*\*\//g
        const comments = string_file.match(regex)
        return comments ? comments : []
    }

    function findCodeDebt(comment) {
        const regex = new RegExp(patterns_list.join('|'), 'i')
        var debts = comment.match(regex)
        if (debts) result.debts++
    }

    log.silly('getCodeDebtFromFile', 'Result:', result)

    return result
}