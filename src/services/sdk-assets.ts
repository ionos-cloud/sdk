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

const SDK_VAR_NOT_FOUND_TAG = '<!sdk_var_not_found>'
const ENV_VAR_NOT_FOUND_TAG = '<!env_var_not_found>'

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
  protected shellEnv: {[key: string]: string}

  protected defaultVars: {[key: string]: any} = {}

  constructor(protected genConfig: GenConfig) {

    this.defaultVars = {
      version: genConfig.version,
      outputDir: genConfig.outputDir,
      httpUserAgent: `ionos-cloud-sdk-${genConfig.sdkName}/v${genConfig.version}`,
      packageName: 'ionoscloud',
      repoId: `sdk-${genConfig.sdkName}`,
      repoOwner: DEFAULT_REPO_OWNER,
      repo: `https://github.com/${DEFAULT_REPO_OWNER}/sdk-${genConfig.sdkName}`,
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
      SDK_VERSION: genConfig.version,
      SDK_SPEC: genConfig.specFile,
      SDK_NAME: genConfig.sdkName,
      SDK_RESOURCE_DIR: genConfig.assetsDir,
      SDK_OUTPUT_DIR: genConfig.outputDir,
      ...this.vars.buildEnvFromVars()
    }

    this.openApiConfigPath = this.generateOpenApiConfig()
  }

  public getVars(): Vars {
    return this.vars
  }

  protected async runScript(script: string, cwd = process.cwd()) {
    if (fs.existsSync(script)) {
      await helpers.command.run(script, [ ], { env: this.shellEnv, execaOpts: { cwd } })
    }
  }

  public async runPreGenScript() {
    await this.runScript(path.join(this.genConfig.assetsDir, ...PREGEN_SCRIPT.split('/')), this.genConfig.outputDir)
  }

  public async runPostGenScript() {
    await this.runScript(path.join(this.genConfig.assetsDir, ...POSTGEN_SCRIPT.split('/')), this.genConfig.outputDir)
  }

  public async runGenScript() {
    await this.runScript(path.join(this.genConfig.assetsDir, ...GEN_SCRIPT.split('/')), this.genConfig.outputDir)
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
        return this.getVars().get(varRef) || SDK_VAR_NOT_FOUND_TAG
      })

      /* replace {{ env.* }} tags with env values */
      .replaceAll(/{{\s*env\.\w+\s*}}/g, (match: string): string => {
        const varRef = match.substring(2, match.length - 2).trim().split('.')[1]
        return process.env[varRef] || ENV_VAR_NOT_FOUND_TAG
      })

  }
}
