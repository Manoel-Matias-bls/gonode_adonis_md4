'use strict'

const Mail = use('Mail')
const Helpers = use('Helpers')

class NewTaskMail {
  /** Limita a quantidade de tarefas que serão
   *  enviadas via paralelismo do processador */
  static get concurrency () {
    return 1
  }

  /** representa uma chave única para cada job da aplicação */
  static get key () {
    return 'NewTaskMail-job'
  }

  /** Método que conterá a lógica do job
   * no caso, a lógica do envio de emails.
   */
  async handle ({ email, username, title, file }) {
    console.log(`Job: ${NewTaskMail.key}`)

    await Mail.send(
      ['emails.new_task'],
      { username, title, hasAttachment: !!file },
      message => {
        message
          .to(email)
          .from('manoel@gmail.com ', 'Manoel | MNS MEI')
          .subject('Nova tarefa para você')

        if (file) {
          message.attach(Helpers.tmpPath(`uploads/${file.file}`), {
            filename: file.name
          })
        }
      }
    )
  }
}

module.exports = NewTaskMail
