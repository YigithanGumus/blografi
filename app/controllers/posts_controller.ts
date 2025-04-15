// import type { HttpContext } from '@adonisjs/core/http'

import Post from "#models/post"
import Category from "#models/category"

export default class PostsController {
  public async index() {
    const posts = await Post.query().preload('categories')
    return posts
  }

  public async show({ params }: { params: { id: number } }) {
    const post = await Post.query().preload('categories').where('id', params.id).firstOrFail()
    return post
  }

  public async create() {

  }

  public async store({ request }: { request: any }) {
    try {
      const categoryIds = request.input('categories', [])
      console.log('Category IDs:', categoryIds)

      if (categoryIds.length > 0) {
        const categories = await Category.query().whereIn('id', categoryIds).exec()
        console.log('Found categories:', categories)

        if (categories.length !== categoryIds.length) {
          throw new Error('Some categories do not exist')
        }
      }

      const post = await Post.create(request.only(['title', 'content', 'user_id', 'status']))
      console.log('Created post:', post)

      if (categoryIds.length > 0) {
        await post.related('categories').attach(categoryIds)
        console.log('Categories attached')
      }

      await post.load('categories')
      console.log('Categories loaded:', post.categories)

      return post
    } catch (error) {
      console.error('Error in store:', error)
      throw error
    }
  }

  public async edit() {
    return "edit"
  }

  public async update({ params, request }: { params: { id: number }, request: any }) {
    const post = await Post.findOrFail(params.id)
    post.merge(request.only(['title', 'content', 'user_id', 'status']))
    await post.save()
    return post
  }

  public async destroy({ params }: { params: { id: number } }) {
    const post = await Post.findOrFail(params.id)
    await post.delete()
    return post
  }
}