#!/bin/sh

# Allow this script to be run via an npm script, without `nvm is not compatible
# with the "npm_config_prefix" environment variable` errors.
unset npm_config_prefix

# Sources the `nvm` command.
. ~/.nvm/nvm.sh

# Delete old snapshots.
rm -rf ./snapshots

for nodeSemverMajor in 8 10 12
do
  echo "\nCreating Node.js v$nodeSemverMajor snapshots…"

  snapshotPath="./snapshots/node-$nodeSemverMajor"

  # Ensure the snapshot directory exists.
  mkdir -p $snapshotPath

  # Install and use the latest patch version for the given Node.js version.
  nvm install $nodeSemverMajor

  # The `script` command is used to snapshot output of the node scripts:
  # https://stackoverflow.com/questions/27397865/how-to-write-stdout-to-file-with-colors#comment76253833_27399198

  snapshotPathPasses="$snapshotPath/stdout-passes.txt"
  snapshotPathFails="$snapshotPath/stdout-fails.txt"

  # The `> /dev/null` silences output, the `|| :` prevents a possible/expected
  # non-zero exit status from the script being snapshotted from affecting the
  # surrounding script’s exit status.

  echo "Creating $snapshotPathPasses"
  script -q $snapshotPathPasses node ./fixtures/passes.js > /dev/null || :

  echo "Creating $snapshotPathFails"
  script -q $snapshotPathFails node ./fixtures/fails.js > /dev/null || :
done
