/*
History Screen
Shows the last 50 recordered temperatures
*/
import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import MainNavigator from './MainNavigator';
import TemperatureItem from '../components/TemperatureItem';

const keyExtractor = item => item.id;

export default class HistoryScreen extends Component {
  state = {
    refreshing: true,
    data: [],
  };

  componentDidMount() {
    this.readData();
  }

  refreshStatus = () => {
    this.setState({
      refreshing: true,
    });
    this.readData();
  };

  readData = ({ props }) => {
    const myData = [];
    props.firestoreRef
      .collection('temperatures')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          myData.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        this.setState({
          data: myData,
          refreshing: false,
        });
      })
      .catch((err) => {
        console.log('Error getting documents', err);
        this.setState({
          refreshing: false,
        });
      });
  };

  renderItem = ({ item }) => <TemperatureItem item={item} />;

  render() {
    const { data, refreshing } = this.state;
    return (
      <View style={styles.contentContainer}>
        <MainNavigator {...this.props} />
        <FlatList
          data={data}
          refreshing={refreshing}
          onRefresh={this.refreshStatus}
          keyExtractor={keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});