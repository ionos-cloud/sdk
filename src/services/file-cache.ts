import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import ui from './ui'
import * as rimraf from 'rimraf'

export class FileCache {

  /* eslint-disable-next-line no-useless-constructor */
  constructor(protected cacheDir: string) { }

  protected logPrefix = '[file-cache]: '
  protected logMsg(msg: string): string {
    return `${this.logPrefix}${msg}`
  }

  public get(key: string): string | undefined {
    const cachedFilePath = path.resolve(this.cacheDir, key)
    if (fs.existsSync(cachedFilePath)) {
      ui.debug(this.logMsg(`${key}: hit`))
      return cachedFilePath
    }

    ui.debug(this.logMsg(`${key}: miss`))
    return undefined
  }

  public put(key: string, filePath: string): string {

    fs.mkdirSync(this.cacheDir, {recursive: true})

    const dst = path.resolve(this.cacheDir, key)

    ui.debug(this.logMsg(`${filePath} → ${key}`))
    fs.copyFileSync(filePath, dst)

    return dst
  }

  public generateKey(filePath: string): string {
    const md5 = crypto.createHash('md5')
    md5.update(filePath)
    return md5.digest('hex')
  }

  public entries(): string[] {
    if (!fs.existsSync(this.cacheDir)) {
      return []
    }
    return fs.readdirSync(this.cacheDir)
  }

  public clear() {
    rimraf.sync(this.cacheDir)
    fs.mkdirSync(this.cacheDir, { recursive: true })
  }
}
