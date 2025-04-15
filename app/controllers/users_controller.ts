// import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class UsersController {
    public async index() {
        const users = await User.query().preload('posts', (query) => {
            query.select(['id', 'title', 'content'])
        })
        return users
    }

    public async show({ params }: { params: { id: number } }) {
        const user = await User.query().where('id', params.id).preload('posts', (query) => {
            query.select(['id', 'title', 'content'])
        }).firstOrFail()
        return user
    }

    public async create() {
        return "create"
    }

    public async store({ request }: { request: any }) {
        const user = await User.create(request.only(['full_name', 'gender','email', 'password']))
        await user.save()
        return user
    }

    public async edit() {
        return "edit"
    }

    public async update({ params, request }: { params: { id: number }, request: any }) {
        const user = await User.findOrFail(params.id)
        user.merge(request.only(['full_name', 'gender','email', 'password']))
        await user.save()
        return user
    }

    public async destroy({ params }: { params: { id: number } }) {
        const user = await User.findOrFail(params.id)
        await user.delete()
        return user
    }

    public async login({ request, response }: HttpContext) {
        const { email, password } = request.only(['email', 'password'])
        
        const user = await User.findBy('email', email)
        if (!user) {
            return response.unauthorized('Invalid credentials')
        }

        const isValidPassword = await hash.verify(user.password, password)
        if (!isValidPassword) {
            return response.unauthorized('Invalid credentials')
        }

        const token = await user.generateToken()
        return {
            user,
            token
        }
    }
}