import { Command } from '@oclif/command'
import ora from 'ora'
import fs from 'fs-extra'
import path from 'path'
import Sync from './sync'
export default class Init extends Command {
  static description = 'create a new project'

  static args = [{ name: 'template', required: true }, { name: 'project', required: true }]

  async run() {
    const parsed = this.parse(Init)
    const spinner = ora(`generating a new ${parsed.args.template} project`).start()
    const config = {
      $schema: 'https://raw.githubusercontent.com/barath-atomleap/delphai-cli/master/src/lib/delphai.schema.json',
      template: parsed.args.template,
      project: parsed.args.project
    }
    const exists = await fs.pathExists(parsed.args.project)
    if (exists) {
      spinner.fail(`directory ${parsed.args.project} already exists`)
    }
    else {
      await fs.mkdirs(parsed.args.project)
      await fs.writeJSON(`${parsed.args.project}/delphai.json`, config, {
        spaces: 2
      })
      spinner.succeed()
      await Sync.run(['--cwd', path.resolve(`${process.cwd()}/${parsed.args.project}`)])
    }
  }
}
