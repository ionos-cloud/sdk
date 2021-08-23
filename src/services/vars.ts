import * as YAML from 'yaml'
import * as fs from 'fs'

const ENV_VAR_PREFIX = 'IONOS_SDK_'
const SDK_VAR_NOT_FOUND_TAG = '<!sdk_var_not_found>'

type VarsCollection = { [key: string]: string }

export class Vars {

  data: VarsCollection

  constructor(varsFile: string, defaults: {[key: string]: any} = {}) {
    this.data = {
      ...defaults,
      ...YAML.parse(
        fs.readFileSync(varsFile).toString()
          .replaceAll(/{{\s*vars.\w+\s*}}/g, (match: string): string => {
            const varRef = match.substring(2, match.length - 2).trim().split('.')[1]
            if (defaults[varRef] === undefined) {
              throw new Error(`variable ${varRef} not found when parsing ${varsFile}`)
            }
            return defaults[varRef] || SDK_VAR_NOT_FOUND_TAG
          })
      ),
      ...this.getVarsFromEnv()
    }
  }

  getVarsFromEnv(): { [key: string]: string } {

    const envVars: {[key: string]: string} = {}

    for (const envVar of Object.keys(process.env)) {
      if (envVar.startsWith(ENV_VAR_PREFIX)) {
        envVars[envVar.substring(ENV_VAR_PREFIX.length)] = process.env[envVar] || ''
      }
    }

    return envVars
  }

  get(key: string): any {
    return this.data[key]
  }

  getAll(): VarsCollection {
    return this.data
  }

  /* build an env struct that exposes the vars */
  buildEnvFromVars(): {[key: string]: any} {
    const ret: {[key: string]: any} = {}
    for (const key of Object.keys(this.data)) {
      ret[`${ENV_VAR_PREFIX}${key}`] = this.data[key]
    }

    return ret
  }
}
