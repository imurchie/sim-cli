#!/usr/bin/env node

const { asyncify } = require('asyncbox');
const { exec } = require('teen_process');
const log = require('fancy-log');
const { argv } = require('yargs');


async function shutdownSim (udid) {
  log(`Shutting down simulator '${udid}'`);
  try {
    await exec('xcrun', ['simctl', 'shutdown', udid]);
  } catch (err) {
    if (err.stderr.includes('Unable to shutdown device in current state: Shutdown')) {
      log(`Simulator already shutdown, continuing`);
    } else {
      throw err;
    }
  }
}

async function eraseSim (udid) {
  log(`Erasing simulator '${udid}'`);
  await exec('xcrun', ['simctl', 'erase', udid]);
}

async function bootSim (udid) {
  log(`Booting simulator '${udid}'`);
  await exec('xcrun', ['simctl', 'boot', udid]);
}


async function main () {
  const udid = argv.u;

  if (argv.s) await shutdownSim(udid);
  if (argv.e) await eraseSim(udid);
  if (argv.b) await bootSim(udid);
}


if (require.main === module) {
  asyncify(main);
}
