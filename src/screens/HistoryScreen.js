/*
History Screen
Shows the last 500 recordered temperatures
*/
import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import MainNavigator from './MainNavigator';
import TemperatureItem from '../components/TemperatureItem';
import { connectAlert } from '../components/Alert';

const keyExtractor = item => item.id;

class HistoryScreen extends Component {
  static propTypes = {
    firestoreRef: PropTypes.object,
    alertWithType: PropTypes.func,
  };

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

  filterData = myData => myData.filter(
    (val, idx) => idx === 0 || val.data.celsius.toFixed(1) !== myData[idx - 1].data.celsius.toFixed(1),
  );

  readData = () => {
    const { firestoreRef, alertWithType } = this.props;
    const myData = [];
    firestoreRef
      .collection('temperatures')
      .orderBy('createdAt', 'desc')
      .limit(500)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          myData.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        const filteredData = this.filterData(myData);
        this.setState({
          data: filteredData,
          refreshing: false,
        });
      })
      .catch((err) => {
        alertWithType('error', 'Read failure!', err);
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

export default connectAlert(HistoryScreen);