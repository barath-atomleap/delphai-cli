import { Command } from '@oclif/command'
import fs from 'fs-extra'
import ora from 'ora'
import toml from 'toml'
import handlebars from 'handlebars'
import path from 'path'
import { config } from '../config'

interface IDependency {
  target: string
  branch: string
  protocol: string
  environment: string
}

interface IProtodep {
  proto_outdir: string
  dependencies: IDependency[]
}

interface IService {
  name: string
  domain: string
}
const templatesPath = path.resolve(`${__dirname}/../../templates`)
export default class Envoy extends Command {
  static description = 'generate envoy config for grpc-web'
  async run() {
    const spinner = ora('reading proto dependencies').start()
    const protodep = await fs.readFile('./protodep.toml', 'utf-8')
    spinner.succeed()
    spinner.text = 'parsing protodep.toml'
    const parsed: IProtodep = toml.parse(protodep)
    spinner.succeed()
    const services: IService[] = []
    for (const dependency of parsed.dependencies) {
      if (dependency.target.startsWith('github.com/delphai')) {
        const repo = dependency.target.replace('github.com/delphai/', '')
        const envName = dependency.environment || 'common'
        const environment = config.environments.find((env) => env.name === envName)
        if (environment) {
          spinner.text = `  processing ${repo} [${environment.name}]`
          const service: IService = {
            name: repo,
            domain: environment.domain,
          }
          services.push(service)
          spinner.succeed()
        } else {
          spinner.fail(`failed to find environment ${dependency.environment}`)
        }
      }
    }
    const template = await fs.readFile(`${templatesPath}/envoy.yaml.hbs`, 'utf-8')
    const compiled = handlebars.compile(template)
    const rendered = compiled({ services })
    await fs.writeFile('./envoy.rendered.yaml', rendered)
    spinner.succeed('generated envoy.yaml')
  }
}
