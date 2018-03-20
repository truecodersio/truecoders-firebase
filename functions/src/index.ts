import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp(functions.config().firebase)

exports.onCreateUser = functions.auth.user().onCreate(event => {
  const user = event.data
  const userObject = {
    displayName: user.displayName,
    email: user.email,
    photoUrl: user.photoURL,
    createdAt: user.metadata.creationTime,
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
