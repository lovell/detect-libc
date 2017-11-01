# Requirements

The following tools are required to run the integration tests successfully.

* Python 2.7, prettytable (`pip install prettytable`)
* Docker

# Usage

```sh
# prepare images (e.g. on dev machine)
./test.py build
./test.py push
# execute tests (e.g. within CI)
./test.py pull
./test.py run
# help
./test.py -h
```
