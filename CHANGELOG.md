## <small>2.1.2 (2025-10-05)</small>

* Add semi-automated changelog #32 ([a950b06](https://github.com/lovell/detect-libc/commit/a950b06)), closes [#32](https://github.com/lovell/detect-libc/issues/32)
* Ensure Node.js 10 and 12 can use async file-based detection methods (#33) ([a418065](https://github.com/lovell/detect-libc/commit/a418065)), closes [#33](https://github.com/lovell/detect-libc/issues/33)

## <small>2.1.1 (2025-09-24)</small>

* Ensure Node.js 10 and 12 can use file-based detection methods (#30) ([e64be76](https://github.com/lovell/detect-libc/commit/e64be76)), closes [#30](https://github.com/lovell/detect-libc/issues/30)

## 2.1.0 (2025-09-14)

* CI: Add non-Linux integration tests for completeness ([f9b7639](https://github.com/lovell/detect-libc/commit/f9b7639))
* Detect libc using the interpreter value from Node's ELF header ([4d6eafe](https://github.com/lovell/detect-libc/commit/4d6eafe))
* CI: Publish tagged commits to npm ([08198d2](https://github.com/lovell/detect-libc/commit/08198d2))
* CI: update integration test expectations ([3a1f323](https://github.com/lovell/detect-libc/commit/3a1f323))

## <small>2.0.4 (2025-04-22)</small>

* TypeScript: Add types field to package.json (#28) ([0362727](https://github.com/lovell/detect-libc/commit/0362727)), closes [#28](https://github.com/lovell/detect-libc/issues/28)
* CI: Add Node.js 20/22, remove CentOS (EOL) ([3ed5518](https://github.com/lovell/detect-libc/commit/3ed5518))
* CI: remove Node.js 22 ([c04d3f2](https://github.com/lovell/detect-libc/commit/c04d3f2))

## <small>2.0.3 (2024-03-19)</small>

* Improve filesystem-based detection of glibc (#22) ([2642d96](https://github.com/lovell/detect-libc/commit/2642d96)), closes [#22](https://github.com/lovell/detect-libc/issues/22)
* Improve getReport performance (#21) ([5e1482d](https://github.com/lovell/detect-libc/commit/5e1482d)), closes [#21](https://github.com/lovell/detect-libc/issues/21)
* CI: bump unit test actions ([646230f](https://github.com/lovell/detect-libc/commit/646230f))
* CI: Latest Void Linux provides glibc 2.39 ([2def922](https://github.com/lovell/detect-libc/commit/2def922))
* CI: Update integration test environments/expectations ([e307a53](https://github.com/lovell/detect-libc/commit/e307a53))
* Tests: include missing coverage in summary ([9117b83](https://github.com/lovell/detect-libc/commit/9117b83))
* chore: refactor by removing a couple variables (#20) ([8cf409b](https://github.com/lovell/detect-libc/commit/8cf409b)), closes [#20](https://github.com/lovell/detect-libc/issues/20)

## <small>2.0.2 (2023-07-18)</small>

* Add credit for e8c0afd ([a3f3efb](https://github.com/lovell/detect-libc/commit/a3f3efb))
* Add SPDX identifiers to all source code files ([d4fd207](https://github.com/lovell/detect-libc/commit/d4fd207))
* Attempt to use contents of /usr/bin/ldd file for greater performance (#19) ([e8c0afd](https://github.com/lovell/detect-libc/commit/e8c0afd)), closes [#19](https://github.com/lovell/detect-libc/issues/19)
* Ensure SPDX in header, correct grammar ([4140056](https://github.com/lovell/detect-libc/commit/4140056))
* CI: Add tests for Node.js 20 ([a077cda](https://github.com/lovell/detect-libc/commit/a077cda))
* Docs: clarify 'version numbers' refers to libc (and not this package) ([d49b8d3](https://github.com/lovell/detect-libc/commit/d49b8d3))
* Test: (unit) add Node.js 18 (integration) add Fedora 38, Ubuntu 22.04 ([6761837](https://github.com/lovell/detect-libc/commit/6761837))

## <small>2.0.1 (2022-02-14)</small>

* Add Void Linux to integration tests ([cde9231](https://github.com/lovell/detect-libc/commit/cde9231))
* Ensure TypeScript defs are valid, fixes initializer error (#15) ([e7c02a7](https://github.com/lovell/detect-libc/commit/e7c02a7)), closes [#15](https://github.com/lovell/detect-libc/issues/15)
* CI: Switch CentOS 8 (EOL) to Stream ([2bd0e69](https://github.com/lovell/detect-libc/commit/2bd0e69))

## 2.0.0 (2022-01-19)

* Drop CLI, use its logic for integration tests only ([fc57adf](https://github.com/lovell/detect-libc/commit/fc57adf))
* Ensure only 1 process spawned for older Node.js versions ([0b7ef0b](https://github.com/lovell/detect-libc/commit/0b7ef0b))
* Provide async and sync API, require Node.js >= 8 ([46b45b0](https://github.com/lovell/detect-libc/commit/46b45b0))
