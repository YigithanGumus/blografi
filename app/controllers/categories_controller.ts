// import type { HttpContext } from '@adonisjs/core/http'

import Category from '#models/category'

export default class CategoriesController {
    public async index() {
        const categories = await Category.query().preload('posts', (query) => {
            query.select(['id', 'title', 'content', 'status'])
        })
        return categories
    }

    public async show({ params }: { params: { id: number } }) {
        const category = await Category.query().where('id', params.id).preload('posts', (query) => {
            query.select(['id', 'title', 'content', 'status'])
        }).firstOrFail()
        return category
    }

    public async create() {
        return "create"
    }

    public async store({ request }: { request: any }) {
        const category = await Category.create(request.only(['title', 'status','content']))
        return category
    }

    public async edit() {
        return "edit"
    }

    public async update({ params, request }: { params: { id: number }, request: any }) {
        const category = await Category.findOrFail(params.id)
        category.merge(request.only(['title', 'status','content']))
        await category.save()
        return category
    }

    public async destroy({ params }: { params: { id: number } }) {
        const category = await Category.findOrFail(params.id)
        await category.delete()
        return category
    }
}