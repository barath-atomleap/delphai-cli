import { NodePlopAPI } from 'plop'
import { pascalCase } from 'change-case'
import path from 'path'
import { execute } from './lib/run-command'
import fs from 'fs-extra'
import schema from './lib/delphai.schema.json'
const templatesPath = path.resolve(`${__dirname}/../templates`)
const generators = (plop: NodePlopAPI) => {
  plop.setHelper('pascalCase', (text: string) => {
    return pascalCase(text)
  })
  plop.setGenerator('init', {
    description: 'initial project setup',
    prompts: [
      {
        type: 'input',
        default: path.basename(path.resolve(process.cwd())),
        name: 'project'
      },
      {
        type: 'list',
        choices: schema.properties.language.enum,
        name: 'language'
      },
      {
        type: 'checkbox',
        name: 'features',
        choices: schema.properties.features.items.enum
      }
    ],
    actions: [{
      type: 'addMany',
      templateFiles: `${templatesPath}/python/**/*`,
      destination: '.',
      base: `${templatesPath}/python`,
      force: true
    }, async (answers) => {

      return await execute(`git init ${plop.getDestBasePath()}`)
    },
    async (answers) => {
      const cwd = plop.getDestBasePath()
      const initialized = await fs.pathExists(`${cwd}/.venv`)
      return await execute(`poetry ${initialized ? 'update' : 'install'}`, {
        cwd,
        verbose: true
      })
    }]
  })
}

export default generators