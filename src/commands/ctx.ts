
import { Command, flags } from '@oclif/command'
import { execute } from '../lib/run-command'
import ora from 'ora'

export default class Ctx extends Command {
  static description = 'change the delphai context'

  static args = [{ name: 'context', required: false }]
  static flags = {
    cluster: flags.string({
      char: 'c',
      description: 'kubernetes cluster to connect to',
      required: false
    })
  }
  async run() {
    const parsed = this.parse(Ctx)
    if (parsed.args.context) {
      await execute(`az account set --subscription ${parsed.args.context}`, {
        text: `changing azure context to ${parsed.args.context}`,
      })
      await execute(`kubectx delphai-${parsed.flags.cluster || parsed.args.context}`, {
        text: `changing kubernetes context to ${parsed.flags.cluster || parsed.args.context}`,
      })
    } else {
      const azureContext = JSON.parse(await execute(`az account show`))
      ora(`azure context is ${azureContext.name}`).succeed()
      const kubeContext = (await execute('kubectx --current', {})).replace(
        'delphai-',
        ''
      )
      ora(`kubernetes context is ${kubeContext}`).succeed()

      const spinner = ora('getting available contexts').start()
      const subscriptions: { name: string }[] = JSON.parse(
        await execute('az account list --all')
      )
      spinner.info(`found ${subscriptions.length} contexts`)
      subscriptions.forEach((sub) => {
        const icon = sub.name === azureContext.name ? '🟨' : '🔵'
        this.log(`  ${icon} ${sub.name}`)
      })
    }
  }
}