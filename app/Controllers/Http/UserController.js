'use strict'

const User = use('App/Models/User')

class UserController {

  async store({ response, request }){

    try {
      const data = request.only(['username', 'email', 'password'])

      const userExists = await User.findBy('email', data.email)

      if(userExists){
        return response.status(400).send({ message: { error: 'User already registered' } })
      }

      const user = await User.create(data)

      return user

    } catch (error) {
      return response.status(error.status).send(error)
    }

  }

}

module.exports = UserController
