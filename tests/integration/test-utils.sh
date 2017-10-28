# Do not execute this script directly. Run ./run-tests.sh instead!

execute-test () {
  DOCKER_IMAGE="$1"
  MODULE_DIR=$(readlink -f ../../)

  EXPECTED_FAMILY="$2"
  EXPECTED_VERSION="$3"
  EXPECTED_METHOD="$4"
  EXPECTED_NODEJS="$5"
  EXPECTED_DISTRIBUTION="$6"

  ACTUAL_FAMILY="failed"
  ACTUAL_VERSION="failed"
  ACTUAL_METHOD="failed"
  ACTUAL_NODEJS="failed"
  ACTUAL_DISTRIBUTION="failed"

  # get actual values
  while read -r LINE ;
  do
    if [[ "$LINE" =~ ^Family:\ (.*)$ ]];
    then
      ACTUAL_FAMILY="${BASH_REMATCH[1]}"
    fi
    if [[ "$LINE" =~ ^Version:\ (.*)$ ]];
    then
      ACTUAL_VERSION="${BASH_REMATCH[1]}"
    fi
    if [[ "$LINE" =~ ^Method:\ (.*)$ ]];
    then
      ACTUAL_METHOD="${BASH_REMATCH[1]}"
    fi
    if [[ "$LINE" =~ ^NodeJS:\ (.*)$ ]];
    then
      ACTUAL_NODEJS="${BASH_REMATCH[1]}"
    fi
    if [[ "$LINE" =~ ^Distribution:\ (.*)$ ]];
    then
      ACTUAL_DISTRIBUTION="${BASH_REMATCH[1]}"
    fi
  done < <(docker run --rm -v "$MODULE_DIR:/module" "$DOCKER_IMAGE" sh -c "cd /module && node ./tests/integration/probe.js" 2> /dev/null)

  # validate
  CHECK_SUMMARY="OK"

  if [ "$EXPECTED_FAMILY" = "$ACTUAL_FAMILY" ];
  then
    CHECK_FAMILY="OK"
  else
    CHECK_FAMILY="FAILED"
    CHECK_SUMMARY="FAILED"
  fi

  if [ "$EXPECTED_VERSION" = "$ACTUAL_VERSION" ];
  then
    CHECK_VERSION="OK"
  else
    CHECK_VERSION="FAILED"
    CHECK_SUMMARY="FAILED"
  fi

  if [ "$EXPECTED_METHOD" = "$ACTUAL_METHOD" ];
  then
    CHECK_METHOD="OK"
  else
    CHECK_METHOD="FAILED"
    CHECK_SUMMARY="FAILED"
  fi

  if [ "$EXPECTED_NODEJS" = "$ACTUAL_NODEJS" ];
  then
    CHECK_NODEJS="OK"
  else
    CHECK_NODEJS="FAILED"
    CHECK_SUMMARY="FAILED"
  fi

  if [ "$EXPECTED_DISTRIBUTION" = "$ACTUAL_DISTRIBUTION" ];
  then
    CHECK_DISTRIBUTION="OK"
  else
    CHECK_DISTRIBUTION="FAILED"
    CHECK_SUMMARY="FAILED"
  fi

  # increment counters
  COUNT_TOTAL=$((COUNT_TOTAL+1))
  if [ "$CHECK_SUMMARY" = "OK" ];
  then
    COUNT_SUCCEEDED=$((COUNT_SUCCEEDED+1))
  else
    COUNT_FAILED=$((COUNT_FAILED+1))
  fi

  # print results
  echo "$DOCKER_IMAGE,$EXPECTED_FAMILY,$ACTUAL_FAMILY,$CHECK_FAMILY,$EXPECTED_VERSION,$ACTUAL_VERSION,$CHECK_VERSION,$EXPECTED_METHOD,$ACTUAL_METHOD,$CHECK_METHOD,$EXPECTED_NODEJS,$ACTUAL_NODEJS,$CHECK_NODEJS,$EXPECTED_DISTRIBUTION,$ACTUAL_DISTRIBUTION,$CHECK_DISTRIBUTION,$CHECK_SUMMARY"
}

print-separator () {
  echo "----------"
}

print-header () {
  echo "IMAGE,FAMILY, , ,VERSION, , ,METHOD, , ,NODEJS, , ,DISTRIBUTION, , ,SUMMARY"
  echo " ,EXPECTED,ACTUAL,RESULT,EXPECTED,ACTUAL,RESULT,EXPECTED,ACTUAL,RESULT,EXPECTED,ACTUAL,RESULT,EXPECTED,ACTUAL,RESULT, "
  print-separator
}

print-footer () {
  print-separator
  echo "TOTAL:,$COUNT_TOTAL"
  echo "SUCCEEDED:,$COUNT_SUCCEEDED"
  if [[ $COUNT_FAILED != 0 ]];
  then
    echo "FAILED:,$COUNT_FAILED"
  fi
}
