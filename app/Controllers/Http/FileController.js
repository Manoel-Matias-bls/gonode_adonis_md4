'use strict'

const File = use('App/Models/File')
const Helpers = use('Helpers')

class FileController {
  async show ({ params, response }) {
    try {
      const file = await File.findOrFail(params.id)

      /** poderia ser file.id, já que o file acima
       * é o id do file em si. */
      return response.download(Helpers.tmpPath(`uploads/${file.file}`))
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Erro! Id do arquivo não encontrado' } })
    }
  }

  /**
   * Create/save a new file.
   * POST files
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
      /** Verifica se existe na request um arquivo de nome file
       * caso não exista, lança a exception do catch
       */
      if (!request.file('file')) return

      /** Limita o tamanho do arquivo à 2 megabytes,
       * fica a critério o limite */
      const upload = request.file('file', { size: '2mb' })

      /** Cria o nome do arquivo com
       * timestamps atual.nome do arquivo.extensão do arquivo */
      const fileName = `${Date.now()}.${upload.subtype}`

      /** faz upload do arquivo para pasta tmp
       * ja fora informado no .gitignore para ignora-lá.
       * O Helpers retorna o caminho para uma pasta temporária
       * Resumindo: O arquivo em questão será "upado"
       * para pasta tmp com nome fileName criado acima
       */
      await upload.move(Helpers.tmpPath('uploads'), {
        name: fileName
      })

      /** Se não funcionou adequadamente, chama o catch */
      if (!upload.moved()) {
        throw upload.error()
      }

      /** Após verificar se há o arquivo na request
       * limitar seu tamanho
       * gerar o nome do arquivo físico
       * realizar o upload em si
       * verificar se o upload realmente funcionou
       ** o nome do arquivo fisico, seu nome original,
       * seu type e subtype são persistidos na base
       */
      const file = await File.create({
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype
      })

      return file
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Erro no upload de arquivo' } })
    }
  }
}
module.exports = FileController
