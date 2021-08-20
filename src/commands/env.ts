import {flags} from '@oclif/command'
import BaseCommand from '../base/base-command'
import { GenConfig } from '../models/gen-config'

import { SdkAssets } from '../services/sdk-assets'
import ui from '../services/ui'

export default class Env extends BaseCommand {
  static description = 'Build ENV variables from an assets bundle'

  static flags = {
    ...BaseCommand.flags,
    spec: flags.string({char: 's', description: 'api spec', required: false, default: 'none.json'}),
    version: flags.string({char: 'v', description: 'sdk version', required: false, default: '0.0.0'}),
    name: flags.string({char: 'n', description: 'sdk to build', required: true}),
    'assets-dir': flags.string({char: 'a', description: 'sdk assets directory (templates, scripts etc)', required: true}),
    'output-dir': flags.string({char: 'o', description: 'output dir', required: false, default: ''}),
  }

  static args = [ ...BaseCommand.args ]

  async run() {

    const genConfig = new GenConfig()

    genConfig.version = this.flags.version
    genConfig.outputDir = this.flags['output-dir'] || '.'
    genConfig.assetsDir = this.flags['assets-dir'] || '.'
    genConfig.specFile = this.flags.spec
    genConfig.sdkName = this.flags.name

    /* convert to absolute paths to avoid errors when changing dirs to run commands */
    genConfig.forceAbsPaths()

    const sdkAssets = new SdkAssets(genConfig)
    const env = sdkAssets.getEnv()
    for (const envVar of Object.keys(env)) {
      ui.print(`${envVar}=${env[envVar]}\n`)
    }

  }
}
