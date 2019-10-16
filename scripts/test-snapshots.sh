#!/bin/sh

# “Shell parameter expansion” is used to extract the Node.js SemVer major.
# First the `v` prefix, and then everything from the first `.` is stripped.
nodeVersion=`node -v`
nodeSemver=${nodeVersion#v}
nodeSemverMajor=${nodeSemver%%.*}

echo "\nCreating Node.js v$nodeSemverMajor snapshots…"

snapshotPath="./snapshots/node-$nodeSemverMajor"
snapshotTempPath="./snapshots-temp"
snapshotTempPathPasses="$snapshotTempPath/stdout-passes.txt"
snapshotTempPathFails="$snapshotTempPath/stdout-fails.txt"

fixturePathPasses="./fixtures/passes.js"
fixturePathFails="./fixtures/fails.js"

# Ensure the temporary snapshot directory exists.
mkdir -p $snapshotTempPath

# The `> /dev/null` silences output.

echo "Creating $snapshotTempPathPasses"
if [ $(script -q $snapshotTempPathPasses node $fixturePathPasses > /dev/null; echo $?) -ne 0 ]
then
  echo "$fixturePathPasses didn’t exit with expected status 0."
  exit 1
fi

echo "Creating $snapshotTempPathFails"
if [ $(script -q $snapshotTempPathFails node $fixturePathFails > /dev/null; echo $?) -ne 1 ]
then
  echo "$fixturePathFails didn’t exit with expected status 1."
  exit 1
fi

echo "\nDiffing snapshots…"

git --no-pager diff --no-index $snapshotPath $snapshotTempPath

# Delete the temporary snapshot directory.
rm -rf $snapshotTempPath
