/* eslint-disable react/no-unused-state */ import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import MainNavigator from './MainNavigator';
import { connectAlert } from '../components/Alert';

const backgroundColor = '#694eeb';

class SettingsScreen extends Component {
  static propTypes = {
    firestoreRef: PropTypes.object,
    alertWithType: PropTypes.func,
  };

  state = {
    maxTemp: '',
    minTemp: '',
    error: false,
    loading: true,
  };

  componentDidMount() {
    this.readSettings();
  }

  readSettings = () => {
    const { firestoreRef, alertWithType } = this.props;
    firestoreRef
      .collection('fridge')
      .doc('settings')
      .get()
      .then((doc) => {
        if (doc.exists) {
          const { maxTemp, minTemp } = doc.data();
          this.setState({
            error: false,
            loading: false,
            maxTemp: maxTemp.toFixed(1).toString(),
            minTemp: minTemp.toFixed(1).toString(),
          });
        }
      })
      .catch((err) => {
        alertWithType('error', 'Read failure!', err.message);
        this.setState({ error: true, loading: false });
      });
  };

  writeSettings = () => {
    this.setState({ loading: true });
    const { firestoreRef, alertWithType } = this.props;
    const { maxTemp, minTemp } = this.state;
    if (parseFloat(maxTemp) > parseFloat(minTemp)) {
      firestoreRef
        .collection('fridge')
        .doc('settings')
        .set({ maxTemp: parseFloat(maxTemp), minTemp: parseFloat(minTemp) })
        .then(() => {
          alertWithType('success', 'Success', 'Settings updated.');
          this.setState({ error: false, loading: false });
        })
        .catch((err) => {
          alertWithType('error', 'Write failure!', err.message);
          this.setState({ error: true, loading: false });
        });
    }
  };

  refreshStatus = () => {
    this.readSettings();
  };

  render() {
    const { loading, maxTemp, minTemp } = this.state;
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
        <View style={styles.loading}>{loading && <ActivityIndicator size="large" />}</View>
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
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default connectAlert(SettingsScreen);