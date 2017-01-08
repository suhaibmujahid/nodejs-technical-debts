'use strict';

const log = require('npmlog')
const path = require('path');
const fs = require('fs')

module.exports = findPackageMainFile

function findPackageMainFile(pkg_path) {
    log.silly('findPackageMainFile', pkg_path)

    const stats = fs.statSync(pkg_path)
    if (!stats.isDirectory()) return pkg_path

    const metadata = getPackageMetadata(pkg_path)

    var main_file_path = path.resolve(pkg_path, metadata.main)
    if (typeof main_file_path !== 'string') {
        log.info('Module main file', 'cannot find in metadata, the default will be used (index.js)')
        main_file_path = path.resolve(pkg_path, 'index.js')
    }

    log.silly('findPackageMainFile', 'Result:', main_file_path)
    return main_file_path
}


function getPackageMetadata(pkg_path) {
    log.silly('getPackageMetadata', pkg_path)

    var metadata_path = path.resolve(pkg_path, 'package.json')

    try {
        var metadata_file = fs.readFileSync(metadata_path, {encoding: 'utf8'})
    } catch (e) {
        log.warn('Read package.json', e.message)
        return {}
    }

    try {
        var metadata = JSON.parse(metadata_file)
    } catch (e) {
        log.warn('Parse package.json', e.message)
        return {}
    }

    return metadata
}