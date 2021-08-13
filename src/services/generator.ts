import {SdkAssets} from './sdk-assets'
import * as fs from 'fs'
import ui from './ui'
import { OpenApiGen } from './open-api-gen'
import { Keeper } from './keeper'
import {FileCache} from './file-cache'
import {GenConfig} from '../models/gen-config'

export class Generator {

  protected sdkAssets: SdkAssets

  /* eslint-disable-next-line no-useless-constructor */
  constructor(protected genConfig: GenConfig, protected fileCache: FileCache) {
    this.sdkAssets = new SdkAssets(genConfig)
  }

  public async generate() {

    ui.info(`started generating ${this.genConfig.sdkName}`)
    ui.debug(`output dir: ${this.genConfig.outputDir}`)
    if (this.genConfig.noCache) {
      ui.info('not using the file cache')
    }
    if (!fs.existsSync(this.genConfig.outputDir)) {
      ui.debug(`creating directory ${this.genConfig.outputDir}`)
      fs.mkdirSync(this.genConfig.outputDir, { recursive: true })
    }

    const preservedFilesVar = this.sdkAssets.getVars().get('preservedFiles')
    let preservedFiles: string[] = []
    if (preservedFilesVar !== undefined && preservedFilesVar.length !== 0 && Array.isArray(preservedFilesVar)) {
      preservedFiles = preservedFilesVar as string[]
    }

    if (preservedFiles.length > 0) {
      ui.info(`preserving files: [ ${preservedFiles.join(', ')} ]`)
    } else {
      ui.info('no files specified to preserve')
    }
    const keeper = new Keeper(this.genConfig.outputDir, preservedFiles)
    keeper.save()

    ui.info('running pre-gen script')
    await this.sdkAssets.runPreGenScript()

    if (this.sdkAssets.hasGenScript()) {
      ui.info('running generate script')
      await this.sdkAssets.runGenScript()
    } else {
      /* open api default run */
      ui.info('running openapi-generator')
      const openApiGen = new OpenApiGen(this.genConfig, this.sdkAssets,
        this.genConfig.noCache ? undefined : this.fileCache)
      await openApiGen.run()
    }

    ui.info('running post-gen script')
    await this.sdkAssets.runPostGenScript()

    if (preservedFiles.length > 0) {
      ui.info(`restoring preserved files: [ ${preservedFiles.join(', ')} ]`)
    } else {
      ui.info('no files were preserved, nothing to restore')
    }
    keeper.restore()

    if (this.genConfig.build && this.sdkAssets.hasBuildScript()) {
      ui.info('running build script')
      await this.sdkAssets.runBuildScript()
    }

    ui.success(`successfully generated ${this.genConfig.sdkName}`)
  }
}

