# mini-container

A minimal container runtime that does very few things

```
npm install mini-container -g
```

## Notice

This currently relies on chroot and should be migrated to something like cgroups in the future.

## Usage

A container is just a folder some where on your system that contains a unpacked
linux distro. An easy way to create a container that just has ubuntu 14.04 is to use debootstrap

```
mkdir container
cd container
sudo debootstrap --variant=buildd --arch amd64 trusty . http://archive.ubuntu.com/ubuntu/
```

This will install a local version of ubuntu in `./container`. To boot a bash process inside
this container just do

```
# assuming you are in ./container
sudo mini-container /bin/bash # runs /bin/bash sandboxed in this container
```

## Volumes

mini-container allows you to mount host folders inside your container using the `--volume /host/path=/container/path` flag

```
# mount /home/maf/test from the host on /root/test in the container
sudo mini-container /bin/bash --volume /home/maf/test=/root/test
```

## Programmatic usage

``` js
var mini = require('mini-container')
var child = mini('/bin/bash', {
  cwd: './container',
  volumes: {
    '/home/maf/test': '/root/test'
  }
})
process.stdin.pipe(child.stdin)
child.stdout.pipe(process.stdout)
child.stderr.pipe(process.stderr)
```

## License

MIT
