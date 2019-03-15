/* eslint-disable react/no-unused-state */ import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import MainNavigator from './MainNavigator';

const backgroundColor = '#694eeb';

export default class SettingsScreen extends Component {
  static propTypes = {
    firestoreRef: PropTypes.object,
  };

  state = {
    maxTemp: '',
    minTemp: '',
    error: false,
  };

  componentDidMount() {
    this.readSettings();
  }

  readSettings = () => {
    const { firestoreRef } = this.props;
    firestoreRef
      .collection('fridge')
      .doc('settings')
      .get()
      .then((doc) => {
        if (doc.exists) {
          const { maxTemp, minTemp } = doc.data();
          this.setState({
            error: false,
            maxTemp: maxTemp.toFixed(1).toString(),
            minTemp: minTemp.toFixed(1).toString(),
          });
        }
      })
      .catch((err) => {
        console.log('Read settings failure:', err);
        this.setState({ error: true });
      });
  };

  writeSettings = () => {
    const { firestoreRef } = this.props;
    const { maxTemp, minTemp } = this.state;
    firestoreRef
      .collection('fridge')
      .doc('settings')
      .set({ maxTemp: parseFloat(maxTemp), minTemp: parseFloat(minTemp) })
      .then(() => {
        console.log('Write successful');
      })
      .catch((err) => {
        console.log('Write failure:', err);
        this.setState({ error: true });
      });
  };

  refreshStatus = () => {
    this.readSettings();
  };

  render() {
    const { maxTemp, minTemp } = this.state;
    return (
      <View style={styles.mainView}>
        <MainNavigator {...this.props} />
        <View>
          <FormLabel>Min Temperature</FormLabel>
          <FormInput
            value={minTemp}
            onChangeText={val => this.setState({ minTemp: val })}
            underlineColorAndroid={backgroundColor}
            keyboardType="numeric"
          />
          <FormLabel>Max Temperature</FormLabel>
          <FormInput
            value={maxTemp}
            onChangeText={val => this.setState({ maxTemp: val })}
            underlineColorAndroid={backgroundColor}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            raised
            backgroundColor={backgroundColor}
            onPress={this.writeSettings}
            title="SUBMIT"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'column',
  },
  buttonContainer: {
    marginTop: 20,
  },
});