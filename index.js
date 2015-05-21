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
  var cleanup = []

  var procPath = JSON.stringify(path.resolve(path.join(dir, 'proc')))
  var sysPath = JSON.stringify(path.resolve(path.join(dir, 'sys')))
  var devPath = JSON.stringify(path.resolve(path.join(dir, 'dev')))

  cmds.push('mount -t proc proc ' + procPath)
  cmds.push('mount -t sysfs sys ' + sysPath)

  cleanup.push('umount ' + procPath)
  cleanup.push('umount ' + sysPath)

  Object.keys(volumes).forEach(function (host) {
    var childPath = JSON.stringify(path.join(dir, volumes[host]))
    var hostPath = JSON.stringify(path.resolve(host))
    cmds.push('mkdir -p ' + childPath)
    cmds.push('mount --bind ' + hostPath + ' ' + childPath)
  })

  return '/bin/sh -c \'' + cmds.join('; ') + '\'; chroot . ' + cmd + '; ' + cleanup.join('; ')
}

module.exports = boot
