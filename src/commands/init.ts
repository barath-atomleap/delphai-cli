import { Command, flags } from '@oclif/command'
import ora from 'ora'

export default class Init extends Command {
  static description = 'create a new project'

  static args = [{ name: 'template', required: true }]

  async run() {
    const parsed = this.parse(Init)
    const spinner = ora(`generating a new ${parsed.args.template} project`).start()
    const config = {
      '$schema': 'http://github.com/delphai/delphai-cli/'
    }
  }
}
