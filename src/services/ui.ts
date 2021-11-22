import runConfig from '../models/run-config'
import cli from 'cli-ux'
import * as json from './json'

const indent = ''
const chalk = require('chalk');

function warning(msg: string) {
  // eslint-disable-next-line no-console
  if (process.stderr.isTTY) {
    process.stderr.write(`${chalk.yellowBright('! WARNING:')} ${chalk.yellow(msg)}\n`)
  } else {
    process.stderr.write(`! WARNING: ${msg}\n`)
  }
}

function error(msg: string) {
  // eslint-disable-next-line no-console
  if (process.stderr.isTTY) {
    process.stderr.write(`${chalk.red('! ERROR:')} ${chalk.redBright(msg)}\n`)
  } else {
    process.stderr.write(`! ERROR: ${msg}\n`)
  }
}

function info(msg: string) {
  // eslint-disable-next-line no-console
  cli.info(`${indent}❯ ${msg}`)
}

function debug(msg: string) {
  if (runConfig.debug) {
    // eslint-disable-next-line no-console
    if (process.stderr.isTTY) {
      process.stderr.write(`${indent}${chalk.gray('⇢ (debug)')} ${chalk.gray(msg)}\n`)
    } else {
      process.stderr.write(`${indent}⇢ (debug) ${msg}\n`)
    }
  }
}

function success(msg: string) {
  process.stdout.write(chalk.greenBright(`${indent}✔ ${msg}\n`))
}

function eol() {
  process.stdout.write('\n')
}

function print(data: any) {
  let str = ''
  if (typeof data === 'object') {
    str = json.serialize(data)
  } else {
    str = data
  }

  process.stdout.write(str)
}

function printPatch(patch: string) {
  for (const line of patch.split('\n')) {
    if (line.startsWith('- ')) {
      print(chalk.redBright(line) + '\n')
    } else if (line.startsWith('+ ')) {
      print(chalk.greenBright(line) + '\n')
    } else {
      print(line + '\n')
    }
  }
}

export default {
  debug,
  info,
  warning,
  error,
  success,
  eol,
  print,
  printPatch
}
