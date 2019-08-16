'use strict'

const User = use('App/Models/User')
const Mail = use('Mail')

const moment = require('moment')
const crypto = require('crypto')

class ForgotPasswordController {

  async store({ request }){

    try {

      const { email } = request.only(['email'])

      const user = await User.findByOrFail('email', email)

      // generating token
      const token = await crypto.randomBytes(10).toString('hex')

      user.token_created_at = new Date()

      user.token = token

      await user.save()

      await Mail.send('emails.recover', { user, token }, (message) =>{
        message.from('fliplace@support.com').to(email)
      })

      return user

    } catch (error) {
      console.log(error)
    }

  }

  async update({ response, request, params }){

    const tokenProvided = params.token
    const emailRequesting = params.email

    const { newPassword } = request.only(['newPassword'])

    const user = await User.findByOrFail('email', emailRequesting)

    // checking if token is still the same
    // just to make sure that the user is not using an old link
    // after requesting the password recovery again
    const sameToken = tokenProvided === user.token

    if(!sameToken){
      return response.status(401).send({ message: { error: 'Old token provided or token already used' } })
    }

    // checking if token is still valid (48 hour period)
    const tokenExpired = moment().subtract(2, 'days').isAfter(user.token_created_at)

    if(tokenExpired){
      return response.status(401).send({ message: { error: 'Token expired' } })
    }

    user.password = newPassword
    user.token = null
    user.token_created_at = null

    await user.save()

  }

}

module.exports = ForgotPasswordController
