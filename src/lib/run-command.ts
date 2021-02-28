import ora, { Ora } from 'ora'
import shell from 'shelljs'
interface IOptions {
  text?: string
  verbose?: boolean
  prefix?: string
}
export const execute = async (
  command: string | string[],
  options?: IOptions
): Promise<string> => {
  return new Promise((resolve, reject) => {
    let spinner: Ora
    const finalCommand = Array.isArray(command) ? command.join(' && ') : command
    if (options && (options.text || options.verbose)) {
      spinner = ora(`${options.text || finalCommand}...`).start()
    }
    const proc = shell.exec(
      finalCommand,
      {
        async: true,
        silent: true,
      },
      (code, stdout, stderr) => {
        if (code === 0) {
          if (spinner) {
            spinner.succeed(options ? options.text : finalCommand)
          }
          resolve(stdout)
        } else {
          if (spinner) {
            spinner.fail(stderr)
          }
          reject(stderr)
        }
      }
    )
    proc.stdout.on('data', (data: string) => {
      if (spinner && options && options.verbose) {
        const lines = data
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
        lines.forEach((line) => {
          spinner.info(
            `${options.prefix ? `[${options.prefix}] ` : ''}${line.trim()}`
          )
        })
      }
    })
    proc.stderr.on('data', (data: string) => {
      if (spinner && options && options.verbose) {
        const lines = data
          .split('\n')
          .map((errline) => errline.trim())
          .filter((line) => line.length > 0)
        lines.forEach((line) => {
          spinner.warn(
            `${options.prefix ? `[${options.prefix}] ` : ''}${line.trim()}`
          )
        })
      }
    })
  })
}