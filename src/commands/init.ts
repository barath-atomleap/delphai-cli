import { Command, flags } from '@oclif/command'
import ora from 'ora'
import fs from 'fs-extra'
import path from 'path'
import Sync from './sync'
import schema from '../lib/delphai.schema.json'
import { execute } from '../lib/run-command'
const plopBin = path.resolve(`${__dirname}/../../node_modules/.bin/plop`)
export default class Init extends Command {
  static description = 'create a new project'

  static args = [{ name: 'project', required: true }]
  static flags = {
    language: flags.string({
      char: 'l',
      name: 'language',
      description: 'project language',
      options: schema.properties.language.enum,
    }),
  }
  async run() {
    const parsed = this.parse(Init)
    const langString = parsed.flags.language ? ` ${parsed.flags.language}` : ''
    const spinner = ora(`generating a new${langString} project`).start()
    const exists = await fs.pathExists(parsed.args.project)
    if (exists) {
      spinner.fail(`directory ${parsed.args.project} already exists`)
    } else {
      await fs.mkdirs(parsed.args.project)
      spinner.succeed()
      const plopfilPath = path.resolve(`${__dirname}/../plopfile.js`)
      const command = `${plopBin} init --dest ${path.resolve(
        parsed.args.project
      )} --plopfile ${plopfilPath} ${parsed.args.project}${langString}`
      await execute(command, {
        verbose: true,
        text: 'generated template',
        interactive: true,
      })

      await Sync.run(['--cwd', path.resolve(`${process.cwd()}/${parsed.args.project}`)])
    }
  }
}
