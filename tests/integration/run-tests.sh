#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# check params
SIMPLE_MODE=false

if [ "x$1" = "x-s" ] || [ "x$1" = "x--simple" ];
then
  SIMPLE_MODE=true
fi

# initialize count variables
COUNT_TOTAL=0
COUNT_FAILED=0
COUNT_SUCCEEDED=0

# include test util functions
source ./test-utils.sh

# execute tests and collect result
OUTPUT_FILE=$(mktemp)

print-header >> "$OUTPUT_FILE"
source ./test-specs.sh >> "$OUTPUT_FILE"
print-footer >> "$OUTPUT_FILE"

# print results
if [ "$SIMPLE_MODE" = "true" ];
then
  cat "$OUTPUT_FILE" | column -s "," -t
else
  cat "$OUTPUT_FILE" \
    | column -s "," -t \
    | grep --color=always -P "FAILED|" \
    | less -S -R
fi

rm -f "$OUTPUT_FILE"

# handle exitcode
if [[ $COUNT_FAILED != 0 ]];
then
  exit 1
fi
