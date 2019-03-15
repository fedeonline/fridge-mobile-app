import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import AppNavigator from './src/routes';
import { AlertProvider } from './src/components/Alert';

firebase
  .messaging()
  .hasPermission()
  .then((enabled) => {
    if (enabled) {
      console.log('User has permission');
    } else {
      console.log("User doesn't have permission");
      firebase
        .messaging()
        .requestPermission()
        .then(() => {
          console.log('User has authorised');
        })
        .catch((error) => {
          console.log('ser has rejected permissions');
        });
    }
  });

export default class App extends Component {
  state = {
    uid: null,
  };

  componentDidMount() {
    firebase
      .auth()
      .signInAnonymously()
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`${errorCode}: ${errorMessage}`);
      });

    this.authListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        const { uid } = user;
        this.setState(
          {
            uid,
          },
          this.saveToken,
        );
      } else {
        // User is signed out.
        // ...
      }
    });

    this.notificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed((notification) => {
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
      });
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      // Process your notification as required
    });
  }

  componentWillUnmount() {
    this.notificationDisplayedListener();
    this.notificationListener();
    // this.authListener();
  }

  saveToken = () => {
    const { uid } = this.state;
    // gets the device's push token
    firebase
      .messaging()
      .getToken()
      .then((token) => {
        // stores the token on firebase
        firebase
          .firestore()
          .collection('tokens')
          .doc(uid)
          .set({
            pushToken: token,
          });
      });
  };

  render() {
    return (
      <AlertProvider>
        <AppNavigator />
      </AlertProvider>
    );
  }
}