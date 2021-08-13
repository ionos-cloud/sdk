import BaseCommand from '../base/base-command'
import ui from '../services/ui'
import {FileCache} from '../services/file-cache'

export default class Cache extends BaseCommand {
  static description = 'describe the command here'

  static flags = {
    ...BaseCommand.flags
  }

  static args = [
    ...BaseCommand.args,
    {
      name: 'operation',
      required: true,
      description: 'cache operation to perform',
      hidden: false,
      options: ['clear', 'info']
    }
  ]

  async run() {

    const fileCache = new FileCache(this.config.cacheDir)

    switch (this.args.operation) {
      case 'info': {
        ui.info(`cache dir: ${this.config.cacheDir}`)
        ui.info(`cache entries: ${fileCache.entries().length}`)
        break
      }
      case 'clear': {
        fileCache.clear()
        ui.info('cache cleared')
        break
      }
    }
  }
}
