# Provided by https://github.com/rmg

FROM node:8.8.1
RUN mkdir -p /rootfs
RUN ldd /bin/sh \
        /usr/local/bin/node \
        /lib/x86_64-linux-gnu/libnss_files.so.* \
        /lib/x86_64-linux-gnu/libnss_dns.so.* \
    | grep -o -e '\/\(usr\|lib\)[^ :]\+' \
    | sort -u | tee /rootfs.list \
 && echo /bin/sh >> /rootfs.list

# The use of 'tar | tar' here is a quick'n'dirty replacement for rsync without
# adding any deps: rsync --files-from=/rootfs.list -L -pog / /rootfs/
RUN cat /rootfs.list | tar -T- -cphf- | tar -C /rootfs -xpf-

# noop
FROM scratch
COPY --from=0 /rootfs/ /
