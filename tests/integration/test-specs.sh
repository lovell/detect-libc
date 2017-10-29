# Do not execute this script directly. Run ./run-tests.sh instead!

# Alpine:    Image                          Family  Version   Method       NodeJS    Distribution
execute-test "nodejs-custom:0.10.48-alpine" "musl" "unknown" "filesystem" "0.10.48" "Alpine Linux v3.6"
execute-test "nodejs-custom:0.12.18-alpine" "musl" "1.1.16"  "ldd"        "0.12.18" "Alpine Linux v3.6"
execute-test "node:4.8.5-alpine"            "musl" "1.1.14"  "ldd"        "4.8.5"   "Alpine Linux v3.4"
execute-test "node:6.11.5-alpine"           "musl" "1.1.14"  "ldd"        "6.11.5"  "Alpine Linux v3.4"
execute-test "node:8.8.1-alpine"            "musl" "1.1.16"  "ldd"        "8.8.1"   "Alpine Linux v3.6"

print-separator

# Debian:    Image                          Family  Version   Method       NodeJS    Distribution
execute-test "nodejs-custom:0.10.48-debian" "glibc" "unknown" "filesystem" "0.10.48" "Debian GNU/Linux 8 (jessie)"
execute-test "nodejs-custom:0.12.18-debian" "glibc" "2.19"    "getconf"    "0.12.18" "Debian GNU/Linux 8 (jessie)"
execute-test "node:4.8.5"                   "glibc" "2.19"    "getconf"    "4.8.5"   "Debian GNU/Linux 8 (jessie)"
execute-test "node:6.11.5"                  "glibc" "2.19"    "getconf"    "6.11.5"  "Debian GNU/Linux 8 (jessie)"
execute-test "node:8.8.1"                   "glibc" "2.19"    "getconf"    "8.8.1"   "Debian GNU/Linux 8 (jessie)"

print-separator

# CentOS:    Image                         Family  Version   Method       NodeJS    Distribution
execute-test "nodejs-custom:0.10.x-centos" "glibc" "unknown" "filesystem" "0.10.46" "CentOS Linux 7 (Core)"
execute-test "nodejs-custom:4.x-centos"    "glibc" "2.17"    "getconf"    "4.8.5"   "CentOS Linux 7 (Core)"
execute-test "nodejs-custom:6.x-centos"    "glibc" "2.17"    "getconf"    "6.11.5"  "CentOS Linux 7 (Core)"
execute-test "nodejs-custom:8.x-centos"    "glibc" "2.17"    "getconf"    "8.8.1"   "CentOS Linux 7 (Core)"
