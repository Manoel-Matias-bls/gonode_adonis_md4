'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FileSchema extends Schema {
  up () {
    this.create('files', table => {
      table.increments()
      table.string('file').notNullable() // nome do arquivo fisico
      table.string('name').notNullable() // nome original do arquivo
      table.string('type', 20) // Se é imagem, arquivo pdf, arquivo txt
      table.string('subtype', 20) // Caso seja imagem, é png? é jpg?
      table.timestamps()
    })
  }

  down () {
    this.drop('files')
  }
}

module.exports = FileSchema
