#!/bin/sh

exitCode=0

# “Shell parameter expansion” is used to extract the Node.js SemVer major.
# First the `v` prefix, and then everything from the first `.` is stripped.
nodeVersion=`node -v`
nodeSemver=${nodeVersion#v}
nodeSemverMajor=${nodeSemver%%.*}

snapshotPath="./snapshots/node-$nodeSemverMajor"
snapshotTempPath="./snapshots-temp"

snapshotTempPathPasses="$snapshotTempPath/stdout-passes.txt"
snapshotTempPathFails="$snapshotTempPath/stdout-fails.txt"

fixturePathPasses="./fixtures/passes.js"
fixturePathFails="./fixtures/fails.js"

echo "\nCreating Node.js v$nodeSemverMajor snapshots…"

# Ensure the temporary snapshot directory exists.
mkdir -p $snapshotTempPath

# The `> /dev/null` silences output.

echo "Creating $snapshotTempPathPasses"
passesTestExitCode=$(script -q $snapshotTempPathPasses node $fixturePathPasses > /dev/null; echo $?)

echo "Creating $snapshotTempPathFails"
failsTestExitCode=$(script -q $snapshotTempPathFails node $fixturePathFails > /dev/null; echo $?)

echo "\nChecking exit codes…"

if [ $passesTestExitCode -ne 0 ]
then
  echo "$fixturePathPasses exited with status $passesTestExitCode, expected 0."
  exitCode=1
fi

if [ $failsTestExitCode -ne 1 ]
then
  echo "$fixturePathFails exited with status $failsTestExitCode, expected 1."
  exitCode=1
fi

echo "\nDiffing snapshots…"

git --no-pager diff --no-index $snapshotPath $snapshotTempPath

echo "\nCleaning up…"

# Delete the temporary snapshot directory.
rm -rf $snapshotTempPath

exit $exitCode
