import * as path from 'path'

export class GenConfig {
  specFile = ''
  version = ''
  assetsDir = ''
  outputDir = ''
  sdkName = ''
  build = true
  noCache = false
  packageName = 'ionoscloud'
  artifactId = ''

  public forceAbsPaths() {
    if (!this.assetsDir.startsWith('/')) {
      this.assetsDir = path.join(process.cwd(), this.assetsDir)
    }

    if (!this.specFile.startsWith('/')) {
      this.specFile = path.join(process.cwd(), this.specFile)
    }

    if (!this.outputDir.startsWith('/')) {
      this.outputDir = path.join(process.cwd(), this.outputDir)
    }
  }
}
