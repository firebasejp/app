import Constants from 'expo-constants';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { decode, encode } from 'base-64';

// https://stackoverflow.com/questions/60361519/cant-find-a-variable-atob
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

const host = Constants.manifest.debuggerHost
  ? Constants.manifest.debuggerHost.split(':')[0]
  : 'localhost';

const app: firebase.app.App = firebase.apps.length
  ? firebase.apps[0]
  : firebase.initializeApp({
      apiKey: 'AIzaSyDDkdnaYz1BPVKtncoS1qdbXsby7uy6L2I',
      authDomain: 'firejpug.firebaseapp.com',
      databaseURL: 'https://firejpug.firebaseio.com',
      projectId: __DEV__ ? 'firejpug-dev' : 'firejpug',
      storageBucket: 'firejpug.appspot.com',
      messagingSenderId: '672500308592',
      appId: '1:672500308592:web:9c125499661a632a',
      measurementId: 'G-QGWN9Y50ET',
    });

const db = app.firestore();
if (__DEV__) {
  db.settings({
    host: `${host}:8080`,
    ssl: false,
  });
}

export { app, db };
