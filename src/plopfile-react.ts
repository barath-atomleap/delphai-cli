import { NodePlopAPI } from 'plop'
import path from 'path'
import { execute } from './lib/run-command'
import fs from 'fs-extra'
const templatesPath = path.resolve(`${__dirname}/../templates`)
import klaw from 'klaw'
const generators = (plop: NodePlopAPI) => {
  const prompts = [
    {
      type: 'input',
      default: path.basename(path.resolve(process.cwd())),
      name: 'project',
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
        answers['language'] = 'react'
        answers['$schema'] =
          'https://raw.githubusercontent.com/barath-atomleap/delphai-cli/master/src/lib/delphai.schema.json'
        await fs.writeJSON(`${plop.getDestBasePath()}/delphai.json`, answers, {
          spaces: 2,
        })
        return ''
      },
      ...['init', 'eslint', 'webpack', 'jest', 'typescript'].map((module) => ({
        type: 'addMany',
        templateFiles: `${templatesPath}/react/${module}/**/*`,
        destination: '.',
        stripExtensions: ['hbs'],
        base: `${templatesPath}/react/${module}`,
        force: true,
        globOptions: {
          dot: true,
        },
      })),
      async () => {
        for await (const file of klaw(plop.getDestBasePath())) {
          await fs.rename(file.path, file.path.replace('.hbs', ''))
        }
        return ''
      },
      async () => {
        const cwd = plop.getDestBasePath()
        return await execute('yarn', {
          cwd,
          verbose: true,
        })
      },
      async () => {
        return await execute(['git init', 'git add .', 'git commit -m "feat: inital commit"'], {
          cwd: plop.getDestBasePath(),
          verbose: true,
        })
      },
    ],
  })
  plop.setGenerator('sync', {
    description: 'sync project templates',
    prompts: [
      ...prompts,
      {
        type: 'checkbox',
        name: 'configsToUpdate',
        message: 'Which configurations do you want to update?',
        choices: ['eslint', 'webpack', 'jest', 'typescript'],
      },
    ],
    actions: [
      ...['eslint', 'webpack', 'jest', 'typescript'].map((module) => ({
        type: 'addMany',
        templateFiles: `${templatesPath}/react/${module}/**/*`,
        destination: '.',
        stripExtensions: ['hbs'],
        base: `${templatesPath}/react/${module}`,
        force: true,
        globOptions: {
          dot: true,
        },
        skip: (answers: any) => {
          if (!answers.configsToUpdate.includes(module)) return `Skipping ${module}`
        },
      })),
    ],
  })
}

export default generators
