/**
 * This service encapsulates the whole layout of the set of SDKs assets used to generate the sdks.
 * The components are the following
 * - config
 *   - openapi.yaml
 *   - vars.yaml
 * - scripts
 * - templates
 */

import { Vars } from './vars'
import * as path from 'path'
import * as fs from 'fs'
import { GenConfig } from '../models/gen-config'

import helpers from '../helpers'

const SDK_ASSETS_VARS_FILE = 'config/setup.yaml'
const SDK_ASSETS_OPENAPI_CONFIG_FILE = 'config/openapi.yaml'

/* directories */
const SCRIPTS_D = 'scripts'
const TEMPLATES_D = 'templates'

/* scripts */
const PREGEN_SCRIPT = `${SCRIPTS_D}/pre-gen.sh`
const POSTGEN_SCRIPT = `${SCRIPTS_D}/post-gen.sh`
const GEN_SCRIPT = `${SCRIPTS_D}/generate.sh`
const BUILD_SCRIPT = `${SCRIPTS_D}/build.sh`

const DEFAULT_REPO_OWNER = 'ionos-cloud'

export class SdkAssets {

  protected vars: Vars
  protected openApiConfigPath: string
  public shellEnv: {[key: string]: string}

  protected defaultVars: {[key: string]: any} = {}

  constructor(protected genConfig: GenConfig) {

    this.defaultVars = {
      version: genConfig.version,
      outputDir: genConfig.outputDir,
      httpUserAgent: `ionos-cloud-sdk-${genConfig.sdkName}/v${genConfig.version}`,
      packageName: genConfig.packageName,
      artifactId: genConfig.artifactId,
      repoId: `${genConfig.sdkName}`,
      repoOwner: DEFAULT_REPO_OWNER,
      repo: `https://github.com/${DEFAULT_REPO_OWNER}/${genConfig.sdkName}`,
      openApiGeneratorJar: '/tmp/openapi-generator.jar',
      openApiLang: genConfig.sdkName,
      openApiGlobalProperty: '',
      openApiAdditionalProperties: '',
      openApiTemplateDir: path.join(this.genConfig.assetsDir, TEMPLATES_D),
      preservedFiles: []
    }

    this.vars = new Vars(
      path.join(this.genConfig.assetsDir, ...SDK_ASSETS_VARS_FILE.split('/')),
      this.defaultVars
    )

    this.shellEnv = {
      IONOS_SDK_VERSION: genConfig.version,
      IONOS_SDK_SPEC: genConfig.specFile,
      IONOS_SDK_NAME: genConfig.sdkName,
      IONOS_SDK_ASSETS_DIR: genConfig.assetsDir,
      IONOS_SDK_OUTPUT_DIR: genConfig.outputDir,
      ...this.vars.buildEnvFromVars()
    }

    this.openApiConfigPath = this.generateOpenApiConfig()
  }

  public getEnv(): {[key: string]: any} {
    return this.shellEnv
  }

  public getVars(): Vars {
    return this.vars
  }

  protected async runScript(script: string, cwd = process.cwd(), env = {}) {
    if (fs.existsSync(script)) {
      await helpers.command.run(script, [ ], { env: {...this.shellEnv, ...env}, execaOpts: { cwd } })
    }
  }

  public async runPreGenScript() {
    await this.runScript(path.join(this.genConfig.assetsDir, ...PREGEN_SCRIPT.split('/')), this.genConfig.outputDir)
  }

  public async runPostGenScript() {
    await this.runScript(path.join(this.genConfig.assetsDir, ...POSTGEN_SCRIPT.split('/')), this.genConfig.outputDir)
  }

  public async runGenScript() {
    await this.runScript(path.join(this.genConfig.assetsDir, ...GEN_SCRIPT.split('/')), this.genConfig.assetsDir)
  }

  public hasGenScript(): boolean {
    return fs.existsSync(path.join(this.genConfig.assetsDir, ...GEN_SCRIPT.split('/')))
  }

  public hasBuildScript(): boolean {
    return fs.existsSync(path.join(this.genConfig.assetsDir, ...BUILD_SCRIPT.split('/')))
  }

  public async runBuildScript() {
    await this.runScript(path.join(this.genConfig.assetsDir, ...BUILD_SCRIPT.split('/')), this.genConfig.outputDir)
  }

  /* generates the openapi config based on the template by interpolating sdk vars and env values */
  public generateOpenApiConfig(): string {

    const configTplPath = path.join(this.genConfig.assetsDir, SDK_ASSETS_OPENAPI_CONFIG_FILE)

    if (!fs.existsSync(configTplPath)) {
      throw new Error(`no openapi config yaml found at ${configTplPath}`)
    }

    const configTpl = fs.readFileSync(configTplPath).toString()

    return configTpl

      /* replace {{ vars.* }} tags with variable values */
      .replaceAll(/{{\s*vars\.\w+\s*}}/g, (match: string): string => {
        const varRef = match.substring(2, match.length - 2).trim().split('.')[1]
        const val = this.getVars().get(varRef)
        if (val === undefined) {
          throw new Error(`variable ${varRef} not found when parsing ${configTplPath}`)
        }
        return val
      })

      /* replace {{ env.* }} tags with env values */
      .replaceAll(/{{\s*env\.\w+\s*}}/g, (match: string): string => {
        const varRef = match.substring(2, match.length - 2).trim().split('.')[1]
        const val = process.env[varRef]
        if (val === undefined) {
          throw new Error(`env variable ${varRef} not found when parsing file ${configTplPath}`)
        }
        return val
      })

  }
}
