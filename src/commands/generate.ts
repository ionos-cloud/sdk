import {flags} from '@oclif/command'
import BaseCommand from '../base/base-command'
import { GenConfig } from '../models/gen-config'

import { Generator } from '../services/generator'
import * as path from 'path'
import {FileCache} from '../services/file-cache'

export default class Generate extends BaseCommand {
  static description = 'Generates an Ionos Cloud SDK'

  static flags = {
    ...BaseCommand.flags,
    spec: flags.string({char: 's', description: 'api spec', required: true}),
    version: flags.string({char: 'v', description: 'sdk version', required: true}),
    name: flags.string({char: 'n', description: 'sdk to build', required: true}),
    'assets-dir': flags.string({char: 'a', description: 'sdk assets directory (templates, scripts etc)'}),
    'output-dir': flags.string({char: 'o', description: 'output dir'}),
    build: flags.boolean({char: 'b', description: 'also build the sdk with the build.sh script', default: true}),
    'no-cache': flags.boolean({char: 'c', description: 'don\'t use the cache', default: false})
  }

  static args = [ ...BaseCommand.args ]

  async run() {

    const genConfig = new GenConfig()

    genConfig.version = this.flags.version
    genConfig.outputDir = this.flags['output-dir'] || '.'
    genConfig.assetsDir = this.flags['assets-dir'] || '.'
    genConfig.specFile = this.flags.spec
    genConfig.sdkName = this.flags.name
    genConfig.build = this.flags.build
    genConfig.noCache = this.flags['no-cache']

    /* convert to absolute paths to avoid errors when changing dirs to run commands */
    if (!genConfig.assetsDir.startsWith('/')) {
      genConfig.assetsDir = path.join(process.cwd(), genConfig.assetsDir)
    }

    if (!genConfig.specFile.startsWith('/')) {
      genConfig.specFile = path.join(process.cwd(), genConfig.specFile)
    }

    if (!genConfig.outputDir.startsWith('/')) {
      genConfig.outputDir = path.join(process.cwd(), genConfig.outputDir)
    }

    const generator = new Generator(genConfig, new FileCache(this.config.cacheDir))
    await generator.generate()

  }
}
