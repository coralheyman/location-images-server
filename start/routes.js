'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.group(() => {
  Route.post('/', 'UserController.create').validator('StoreUser');
  Route.post('/login', 'UserController.login');
  Route.get('/', 'UserController.all');
  Route.put('/:id', 'UserController.update');
  Route.delete('/:id', 'UserController.delete');
}).prefix('/api/user')

