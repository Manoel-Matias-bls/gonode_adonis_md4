'use strict'

const Kue = use('Kue')
const Job = use('App/Jobs/NewTaskMail')

const TaskHook = (exports = module.exports = {})

TaskHook.sendNewTaskMail = async taskInstance => {
  if (!taskInstance.user_id && !taskInstance.dirty.user_id) return

  // busca informações do model User. retorna o user relacionado com essa task
  const { email, username } = await taskInstance.user().fetch()

  // captura o arquivo relacionado a essa task, caso haja
  const file = await taskInstance.file().fetch()

  // titulo da task
  const { title } = taskInstance

  Kue.dispatch(Job.key, { email, username, file, title }, { attemps: 3 })
}
