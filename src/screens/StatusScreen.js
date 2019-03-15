/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Image, ImageBackground,
} from 'react-native';
import PTRView from 'react-native-pull-to-refresh';
import Moment from 'moment';
import PropTypes from 'prop-types';
import images from '../res/images';
import MainNavigator from './MainNavigator';

export default class StatusScreen extends Component {
  static propTypes = {
    firestoreRef: PropTypes.object,
  };

  state = {
    status: {},
    error: false,
  };

  componentDidMount() {
    const { firestoreRef } = this.props;
    this.unsubscribe = firestoreRef
      .collection('fridge')
      .doc('status')
      .onSnapshot(this.onCollectionUpdate, this.onConnectionError);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (doc) => {
    const {
      celsius, poweredOn, createdAt, updatedAt,
    } = doc.data();
    const status = {
      temperature: celsius.toFixed(1),
      poweredOn,
      updatedAt,
      createdAt,
    };
    this.setState({
      status,
    });
  };

  onConnectionError = (err) => {
    console.log('Transaction failure:', err);
  };

  readStatus = () => {
    const { firestoreRef } = this.props;
    firestoreRef
      .collection('fridge')
      .doc('status')
      .get()
      .then((documentSnapshot) => {
        const {
          celsius, poweredOn, createdAt, updatedAt,
        } = documentSnapshot.data();
        console.log(celsius, poweredOn, createdAt, updatedAt);
        const status = {
          temperature: celsius.toFixed(1),
          poweredOn,
          updatedAt,
          createdAt,
        };
        this.setState({ error: false, status });
      })
      .catch((err) => {
        console.log('Transaction failure:', err);
        this.setState({ error: true });
      });
  };

  refreshStatus = () => {
    this.readStatus();
  };

  ledImageSource = () => {
    const { status } = this.state;
    if (status.poweredOn == null) return images.amberLed;
    return status.poweredOn ? images.greenLed : images.redLed;
  };

  render() {
    const imageSrc = this.ledImageSource();
    const { status } = this.state;
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <MainNavigator {...this.props} />
        <PTRView onRefresh={this.refreshStatus}>
          <View style={styles.container}>
            <View style={styles.fridge}>
              <ImageBackground source={images.fridge} style={styles.image}>
                <Image source={imageSrc} style={styles.led} />

                <View style={{ flexDirection: 'column', flexWrap: 'wrap' }}>
                  <Text style={styles.unit}>°C</Text>
                  <Text style={styles.temp}>{status.temperature ? status.temperature : ' '}</Text>
                </View>
              </ImageBackground>
            </View>
            <Text style={styles.update}>
              Last update
              {' '}
              {Moment(status.updatedAt).format('DD MMM HH:mm')}
            </Text>
          </View>
        </PTRView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  update: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
    color: '#656565',
  },
  container: {
    marginTop: 85,
    alignItems: 'center',
  },
  fridge: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  image: {
    flexGrow: 1,
    height: 360,
    width: 360,
    alignItems: 'center',
    justifyContent: 'center',
  },
  led: {
    marginBottom: 130,
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  temp: {
    fontSize: 52,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  unit: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});