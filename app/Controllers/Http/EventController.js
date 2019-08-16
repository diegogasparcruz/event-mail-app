'use strict'

const Event = use('App/Models/Event')

class EventController {

  async store ({ request, response, auth }) {

    try {

      const { title, location, data, time } = request.all()
      const userID = auth.user.id

      const newEvent = await Event.create({ user_id: userID, title, location, data, time })

      return newEvent

    } catch (err) {
      return response.status(err.status).send({ message: { error: 'Something went wrong while creating new event' } })
    }

  }

  async index({ response, auth }){

    try {

      const userID = auth.user.id

      const events = await Event.query()
        .where({
          user_id: userID
        }).fetch()

      return events

    } catch (error) {
      return response.status(error.status)
    }

  }

  async show({ response, request, auth }){

    try {
      const { data } = request.only(['data'])
      const userID = auth.user.id

      const event = await Event.query()
        .where({
          user_id: userID,
          data
        }).fetch()

      if(event.rows.length === 0){
        return response.status(404).send({ message: { error: 'No event found' } })
      }

      return event

    } catch (err) {

      if(err.name === 'ModelNotFoundException'){
        return response.status(err.status).send({ message: { error: 'No event found' } })
      }

      return response.status(err.status)
    }

  }

  async destroy({ response, params, auth }){

    try {

      const eventID = params.id
      const userID = auth.user.id

      const event = await Event.query()
        .where({
          id: eventID,
          user_id: userID
        }).fetch()

        const jsonEvent = event.toJSON()[0]

        if(jsonEvent['user_id'] !== userID){

          return response.status(401).send({ message: { error: 'You are not allowed to delete this event' } })
        }

        await Event.query()
          .where({
            id: eventID,
            user_id: userID
          }).delete()

    } catch (error) {
      return response.status(error.status)
    }

  }

}

module.exports = EventController
