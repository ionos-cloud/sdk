import * as execa from 'execa'
import ui from '../services/ui'
import runConfig from '../models/run-config'

export async function run(cmd: string, args: any[] = [],
  options: {workDir?: string; env?: {[key: string]: string}; execaOpts?: { [key: string]: string}} = {}) {

  const cmdStr = `${cmd} ${args.join(' ')}`

  const defaultOptions = {
    workDir: process.cwd(),
    env: {},
    execaOpts: {}
  }

  const opts = {
    ...defaultOptions,
    ...options
  }

  const subprocess = execa(cmd, args, {all: true, cwd: opts.workDir, env: opts.env, ...opts.execaOpts})
  try {
    ui.debug(`running ${cmdStr}`)
    if (runConfig.debug) {
      subprocess.stdout.pipe(process.stdout)
      subprocess.stderr.pipe(process.stderr)
    }
    await subprocess

  } catch (error) {
    // ui.print(error.all)
    ui.error(`command ${cmdStr} failed!`)
    throw new Error(error.message)
  }
}
