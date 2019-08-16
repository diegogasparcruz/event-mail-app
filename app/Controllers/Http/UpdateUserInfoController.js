'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')

class UpdateUserInfoController {

  async update({ response, request, params }){

    const id = params.id
    const { username, password, newPassword } = request.only(['username', 'password', 'newPassword'])

    const user = await User.findByOrFail('id', id)

    const passwordCheck = await Hash.verify(password, user.password)

    if(!passwordCheck){
      return response.status(400).send({ message: { error: 'Inconrrect password provided' } })
    }

    user.username = username
    user.password = newPassword

    await user.save()

  }

}

module.exports = UpdateUserInfoController
