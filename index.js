'use strict';

const path = require('path');
const fs = require('fs')
const log = require('npmlog')
const patterns_list = require('./patterns_list.js')
module.exports = getPackageCodeDebt
// log.level = 'silly'
getPackageCodeDebt("./readable-stream")

function getPackageCodeDebt(pkg_path) {
    log.info('getPackageCodeDebt', pkg_path)

    var metadata = getPackageMetadata(pkg_path)
    var main_file_path = getMainFilePath(metadata, pkg_path)

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
    log.silly('getPackageCodeDebt', result)
    return result
}

function getPackageMetadata(pkg_path) {
    log.silly('getPackageMetadata', pkg_path)

    var metadata_path = path.join(pkg_path, 'package.json')

    try {
        var metadata_file = fs.readFileSync(metadata_path, {encoding: 'utf8'})
    } catch (e) {
        log.warn('Read package.json', e.message)
        return false
    }

    try {
        var metadata = JSON.parse(metadata_file)
    } catch (e) {
        log.warn('Parse package.json', e.message)
        return false
    }

    return metadata
}

function getMainFilePath(metadata, pkg_path) {
    log.silly('getMainFilePath', pkg_path)

    var main_file_path = path.join(pkg_path, metadata.main)
    if (typeof main_file_path !== 'string') {
        log.info('Module main file', 'cannot find in metadata, the default will be used (index.js)')
        return path.join(pkg_path, 'index.js')
    }
    return main_file_path
}

function getFileContent(file_path) {
    log.silly('getFileContent', file_path)

    try {
        var file = fs.readFileSync(file_path, {encoding: 'utf8'})
        console.log('\n\n******** suahib ***********\n')
        console.log(require.resolve('./node_modules/are-we-there-yet/'))
    } catch (e) {
        log.warn('Cannot read the code file', e.message)
        return ''
    }

    return file;
}

function getFileLocalDepList(file, file_path) {
    log.silly('getFileLocalDepList', file_path)

    const regex = /require\(.\.\/(.*?)\.js.\)/g
    var deps = file.match(regex)

    if (!deps) return []

    var result = [];
    deps.forEach(function (dep) {
        dep = dep.substring(9, dep.length - 2)
        var dir = path.dirname(file_path)
        var dep_path = path.join(dir, dep)
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