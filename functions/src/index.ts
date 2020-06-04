import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp(functions.config().firebase)

export * as events_v1 from './events'
