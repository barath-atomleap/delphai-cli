import { Command, flags } from '@oclif/command'
import path from 'path'
import { execute } from '../lib/run-command'
import fs from 'fs-extra'
const plopBin = path.resolve(`${__dirname}/../../node_modules/.bin/plop`)
export default class Init extends Command {
  static description = 'sync the project with the latest template'
  static flags = {
    cwd: flags.string({
      char: 'd',
      description: 'working directory',
      default: process.cwd(),
    }),
  }
  async run() {
    const parsed = this.parse(Init)
    const plopfilPath = path.resolve(`${__dirname}/../plopfile.js`)
    const config = await fs.readJSON(`${path.resolve(parsed.flags.cwd)}/delphai.json`)
    const featuresString =
      config.features && config.features.length > 0 ? ` ${config.features.join(',')}` : ''
    const command = `${plopBin} sync --dest ${path.resolve(
      parsed.flags.cwd
    )} --plopfile ${plopfilPath} ${config.project} ${config.language}${featuresString}`
    await execute(command, {
      verbose: true,
      text: 'generated template',
      interactive: true,
    })
  }
}
