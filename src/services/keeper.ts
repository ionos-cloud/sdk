import * as fs from 'fs'
import * as path from 'path'
import * as rimraf from 'rimraf'
import ui from './ui'

export class Keeper {

  protected tmpDir = ''

  /* eslint-disable-next-line no-useless-constructor */
  constructor(protected rootDir: string, protected fileList: string[]) { }

  public save() {
    if (this.tmpDir.length !== 0) {
      throw new Error('[keeper]: save() called twice; already preserving a list of files')
    }

    this.tmpDir = fs.mkdtempSync(path.join(path.sep, 'tmp', 'sdk-'))
    ui.debug(`[keeper]: saving to ${this.tmpDir}`)
    ui.debug(`[keeper]: saving [ ${this.fileList.join(',')} ]`)

    this.copyFromTo(this.rootDir, this.tmpDir)
  }

  public restore() {
    if (this.tmpDir.length === 0) {
      throw new Error('[keeper]: restore() called before save(); no files preserved yet')
    }

    ui.debug(`[keeper]: restoring from ${this.tmpDir}`)
    ui.debug(`[keeper]: restoring [ ${this.fileList.join(',')} ]`)
    this.copyFromTo(this.tmpDir, this.rootDir)

    rimraf.sync(this.tmpDir)
    this.tmpDir = ''
  }

  protected copyFromTo(from: string, to: string) {
    for (const file of this.fileList) {

      const src = path.join(from, file)
      const dstDir = path.join(to, path.dirname(file))
      const dstBaseName = path.basename(file)
      const dst = path.join(dstDir, dstBaseName)

      if (fs.existsSync(src)) {
        fs.mkdirSync(dstDir, {recursive: true})
        fs.copyFileSync(src, dst)
      } else {
        ui.warning(`[keeper]: ${file} doesn't exist`)
      }

    }
  }

}
