import { Command, flags } from '@oclif/command'
import { execute } from '../lib/run-command'
import atob from 'atob'
import Table from 'cli-table'
export default class Secrets extends Command {
  static description = 'get kubernetes secrets'

  static flags = {
    namespace: flags.string({
      name: 'namespace',
      char: 'n',
      default: 'default',
    }),
  }

  async run() {
    const parsed = this.parse(Secrets)
    const secrets: { items: any[] } = JSON.parse(
      await execute(
        `kubectl get secrets --namespace ${parsed.flags.namespace} --output json`,
        {
          text: `listing secrets in the ${parsed.flags.namespace} namespace`,
        }
      )
    )
    const table = new Table({
      head: ['Key', 'Value'],
      colWidths: [50, (process.stdout.columns as number) - 53]
    })
    secrets.items.forEach((secret) => {
      const name = secret.metadata.name
      if (!name.includes('token') && !name.includes('tls')) {
        Object.keys(secret.data)
          .filter((key) => !key.includes('tls') && !key.includes('token'))
          .forEach((key) => {
            table.push([`${name}.${key}`, atob(secret.data[key])])
          })
      }
    })
    console.log(table.toString())
  }
}