'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('sessions', 'SessionController.create')

Route.post('users', 'UserController.store')
Route.post('users/forgotPassword', 'ForgotPasswordController.store')
Route.put('users/forgotPassword/:token/:email', 'ForgotPasswordController.update')

//Rotas que precisam de autorização
Route.group(() => {

  Route.put('users/:id', 'UpdateUserInfoController.update')

  Route.post('events/new', 'EventController.store')
  Route.get('events/list', 'EventController.index')
  Route.get('events/list/data', 'EventController.show')
  Route.delete('events/:id/delete', 'EventController.destroy')

}).middleware(['auth'])
