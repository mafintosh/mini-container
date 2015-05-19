#!/usr/bin/env node

var minimist = require('minimist')
var path = require('path')
var boot = require('./')

var argv = minimist(process.argv.slice(2), {
  alias: {
    volume: 'v',
    cwd: 'c',
    print: 'p'
  },
  boolean: ['print']
})

var toMap = function (list) {
  var result = {}
  list = [].concat(list)
  list.forEach(function (map) {
    var i = map.indexOf('=')
    result[path.resolve(map.slice(0, i))] = map.slice(i + 1)
  })
  return result
}

var opts = {
  cwd: argv.cwd,
  volumes: toMap(argv.volume || []),
  stdio: 'inherit'
}

var command = argv._[0]

if (!command || argv.help) {
  console.log(require('fs').readFileSync(path.join(__dirname, 'help.txt'), 'utf-8'))
  return
}

if (argv.print) console.log(boot.command(cmd, opts))
else boot(command, opts)
