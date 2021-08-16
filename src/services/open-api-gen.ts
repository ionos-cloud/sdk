import helpers from '../helpers'
import { SdkAssets } from './sdk-assets'
import * as fs from 'fs'
import * as path from 'path'
import axios from 'axios'

import ui from './ui'
import {FileCache} from './file-cache'
import {GenConfig} from '../models/gen-config'

export class OpenApiGen {

  protected jarPath: string | undefined = undefined

  /* eslint-disable-next-line no-useless-constructor */
  constructor(protected genConfig: GenConfig, protected sdkAssets: SdkAssets, protected fileCache?: FileCache) {
  }

  public async getJarPath(): Promise<string> {
    if (this.jarPath !== undefined) {
      return this.jarPath
    }

    this.jarPath = await this.fetchJar(this.sdkAssets.getVars().get('openApiGeneratorJar'))
    return this.jarPath
  }

  public async run() {

    /* generate the openapi config yaml file and write it to a temporary location */
    const openApiConfig = this.sdkAssets.generateOpenApiConfig()
    const timeStamp = Math.floor(Date.now() / 1000)
    const tmpConfigFile = path.join(path.sep, 'tmp', `${this.genConfig.sdkName}-openapi-config-${timeStamp}.yaml`)
    fs.writeFileSync(tmpConfigFile, openApiConfig)

    ui.debug(`openapi config file ${tmpConfigFile}:\n` + openApiConfig)

    const vars = this.sdkAssets.getVars()

    const args = [

      /* the openapi generator jar */
      '-jar', await this.getJarPath(),

      'generate',

      '-g', vars.get('openApiLang'),
      '-c', tmpConfigFile,
      '-i', this.genConfig.specFile,
      '--http-user-agent', vars.get('httpUserAgent'),
      '--git-user-id', vars.get('repoOwner'),
      '--git-repo-id', vars.get('repoId')

    ]

    const globalProperty = vars.get('openApiGlobalProperty')
    if (globalProperty !== undefined && globalProperty.length > 0) {
      args.push('--global-property', globalProperty)
    }

    const additionalProperties = vars.get('additionalProperties')
    if (additionalProperties !== undefined && additionalProperties.length > 0) {
      args.push('--additional-properties', additionalProperties)
    }

    ui.debug('running openapi-generator:')
    ui.debug(['java', ...args].join(' '))
    await helpers.command.run('java', args)

    /* cleanup */
    ui.debug(`removing openapi config file ${tmpConfigFile}`)
    fs.unlinkSync(tmpConfigFile)
  }

  protected async download(url: string, dst: string) {

    ui.info(`downloading ${url} → ${dst}`)
    const writer = fs.createWriteStream(path.resolve(dst))

    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    })

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  }

  protected async fetchJar(jarUrl: string): Promise<string> {

    if (!jarUrl.startsWith('https://')) {
      return jarUrl
    }

    let cacheKey = ''
    if (this.fileCache !== undefined) {
      /* remote jar, download it and cache it */
      cacheKey = this.fileCache.generateKey(jarUrl)
      const cachedFilePath = this.fileCache.get(cacheKey)

      if (cachedFilePath !== undefined) {
        /* cache hit */
        ui.info('openapi generator jar file found in cache')
        return cachedFilePath
      }
    }

    const tmpJarFile = `/tmp/openapi-generator-cli-${Math.floor(Date.now() / 1000)}.jar`

    await this.download(jarUrl, tmpJarFile)

    if (this.fileCache !== undefined) {
      ui.info('saving openapi generator jar file in cache')
      return this.fileCache.put(cacheKey, tmpJarFile)
    }

    return tmpJarFile
  }

}
