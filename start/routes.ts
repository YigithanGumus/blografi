/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import CategoriesController from '#controllers/categories_controller'
import PostsController from '#controllers/posts_controller'
import UsersController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/login', [UsersController, 'login'])

router.group(() => {
  router.resource('posts', PostsController)
  router.resource('categories', CategoriesController)
}).use(middleware.auth())

router.resource('users', UsersController)
