import {Elysia} from 'elysia'

const app = new Elysia()
    .get('/', () => 'Hello Elysia')
    .listen(8080)

console.log(`🦊 Elysia is running at on port ${app.server?.port}...`)