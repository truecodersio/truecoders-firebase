// Interfaces

interface UserObject {
  firstName?: string
  lastName?: string
  email?: string
  photoUrl?: string
  createdAt?: string
}

// Imports

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// Setup

admin.initializeApp(functions.config().firebase)

// Functions

exports.onCreateUser = functions.auth.user().onCreate(event => {
  const user = event.data
  const userObject: UserObject = {}

  if (user.email) {
    userObject.email = user.email
  }

  if (user.photoURL) {
    userObject.photoUrl = user.photoURL
  }

  if (user.displayName && user.displayName.length > 0) {
    const names = user.displayName.split(' ')
    userObject.firstName = names[0]

    if (names.length > 1) {
      userObject.lastName = names[names.length - 1]
    }
  }

  if (user.metadata.creationTime) {
    userObject.createdAt = user.metadata.creationTime
  }

  return admin
    .database()
    .ref(`users/${user.uid}`)
    .set(userObject)
})

exports.onDeleteUser = functions.auth.user().onDelete(event => {
  const user = event.data
  return admin
    .database()
    .ref(`users/${user.uid}`)
    .remove()
})
