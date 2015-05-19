var path = require('path')
var execspawn = require('execspawn')

var boot = function (cmd, opts) {
  return execspawn(boot.command(cmd, opts), opts)
}

boot.command = function (cmd, opts) {
  if (typeof cmd !== 'string') throw new Error('Command must be a string')
  if (!opts) opts = {}

  var dir = opts.cwd || process.cwd()
  var volumes = opts.volumes || {}
  var cmds = []

  cmds.push('mount -t proc proc ' + JSON.stringify(path.join(dir, 'proc')))

  Object.keys(volumes).forEach(function (host) {
    var childPath = JSON.stringify(path.join(dir, volumes[host]))
    var hostPath = JSON.stringify(host)
    cmds.push('mkdir -p ' + childPath)
    cmds.push('mount --bind ' + hostPath + ' ' + childPath)
  })

  return '/bin/sh -c \'' + cmds.join('; ') + '\' >/dev/null 2>&1; chroot . ' + cmd
}

module.exports = boot
