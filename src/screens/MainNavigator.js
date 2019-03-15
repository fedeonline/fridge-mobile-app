/*
MainNavigator
*/
import React from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

const backgroundColor = '#694eeb';

export default function MainNavigator({ navigation }) {
  return (
    <View style={styles.mainView}>
      <TouchableHighlight
        style={{ marginLeft: 10, marginTop: 0 }}
        onPress={() => {
          navigation.openDrawer();
        }}
      >
        <Icon name="menu" size={32} color="#eee" />
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor,
    alignItems: 'center',
  },
});

MainNavigator.propTypes = {
  navigation: PropTypes.object.isRequired,
};