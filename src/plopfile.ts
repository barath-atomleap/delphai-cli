import { NodePlopAPI } from 'plop'
import path from 'path'
import { execute } from './lib/run-command'
import fs from 'fs-extra'
import schema from './lib/delphai.schema.json'
import klaw from 'klaw'
const templatesPath = path.resolve(`${__dirname}/../templates`)
const generators = (plop: NodePlopAPI) => {
  const prompts = [
    {
      type: 'input',
      default: path.basename(path.resolve(process.cwd())),
      name: 'project',
    },
    {
      type: 'list',
      choices: schema.properties.language.enum,
      name: 'language',
    },
    {
      type: 'checkbox',
      name: 'features',
      choices: schema.properties.features.items.enum,
      default: [],
    },
  ]
  plop.setHelper('ifIn', (elem, list, options) => {
    if (list.indexOf(elem) > -1) {
      return options.fn(this)
    }
    return options.inverse(this)
  })
  plop.setHelper('ifNotIn', (elem, list, options) => {
    if (list.indexOf(elem) == -1) {
      return options.fn(this)
    }
    return options.inverse(this)
  })
  plop.setGenerator('init', {
    description: 'initialize project',
    prompts,
    actions: [
      async (answers) => {
        answers['$schema'] =
          'https://raw.githubusercontent.com/barath-atomleap/delphai-cli/master/src/lib/delphai.schema.json'
        await fs.writeJSON(`${plop.getDestBasePath()}/delphai.json`, answers, {
          spaces: 2,
        })
        return ''
      },
    ],
  })
  plop.setGenerator('sync', {
    description: 'sync project templates',
    prompts,
    actions: [
      (answers: any) => {
        if (answers.features.includes('grpc_server') || answers.features.includes('grpc_client')) {
          answers.features.push('grpc')
        }
        return ''
      },
      {
        type: 'addMany',
        templateFiles: `${templatesPath}/{{language}}/**/*`,
        destination: '.',
        stripExtensions: ['hbs'],
        base: `${templatesPath}/{{language}}`,
        force: true,
        globOptions: {
          dot: true,
        },
      },
      {
        type: 'addMany',
        templateFiles: `${templatesPath}/grpc-server/**/*`,
        destination: '.',
        stripExtensions: ['hbs'],
        base: `${templatesPath}/grpc-server`,
        force: true,
        globOptions: {
          dot: true,
        },
        skip: (answers) => {
          return !answers.features.includes('grpc_server')
        },
      },
      async () => {
        for await (const file of klaw(plop.getDestBasePath())) {
          await fs.rename(file.path, file.path.replace('.hbs', ''))
        }
        return ''
      },
      async () => {
        const cwd = plop.getDestBasePath()
        const initialized = await fs.pathExists(`${cwd}/.venv`)
        return await execute(`poetry ${initialized ? 'update' : 'install'}`, {
          cwd,
          verbose: true,
        })
      },
      async (answers: any) => {
        if (answers.features.includes('grpc')) {
          const cwd = plop.getDestBasePath()
          await execute(['protodep up --force', 'poetry run poe codegen'], {
            cwd,
            text: 'running codegen',
          })
        }
        return ''
      },
      async () => {
        const gitInitialized = await fs.pathExists(`${plop.getDestBasePath()}/.git`)
        if (!gitInitialized) {
          return await execute(['git init', 'git add .', 'git commit -m "feat: inital commit"'], {
            cwd: plop.getDestBasePath(),
            verbose: true,
          })
        }
        return ''
      },
    ],
  })
}

export default generators
