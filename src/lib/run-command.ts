import ora, { Ora } from 'ora'
import shell from 'shelljs'
import cp from 'child_process'
interface IOptions {
  text?: string
  verbose?: boolean
  prefix?: string
  cwd?: string
  interactive?: boolean
}
export const execute = async (
  command: string | string[],
  options: IOptions = {}
): Promise<string> => {
  return new Promise((resolve, reject) => {
    let spinner: Ora
    const finalCommand = Array.isArray(command) ? command.join(' && ') : command
    const cwd = options.cwd ? options.cwd : process.cwd()
    if (!options.interactive) {
      if (options.text || options.verbose) {
        spinner = ora(`${options.text || finalCommand}...`).start()
      }
      const proc = shell.exec(
        finalCommand,
        {
          async: true,
          silent: true,
          cwd,
        },
        (code, stdout, stderr) => {
          if (code === 0) {
            if (spinner) {
              spinner.succeed(options.text ? options.text : finalCommand)
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
            spinner.info(`${options.prefix ? `[${options.prefix}] ` : ''}${line.trim()}`)
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
            spinner.warn(`${options.prefix ? `[${options.prefix}] ` : ''}${line.trim()}`)
          })
        }
      })
    } else {
      let commands = command
      if (!Array.isArray(command)) {
        commands = [command]
      }
      for (const cmd of commands) {
        const split = cmd.split(' ')
        cp.execFileSync(split[0], split.slice(1), { stdio: 'inherit' })
        resolve('')
      }
    }
  })
}
