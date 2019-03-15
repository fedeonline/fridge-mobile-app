import React from 'react';
import { Dimensions } from 'react-native';
import { createDrawerNavigator, createAppContainer } from 'react-navigation';

// Screens
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from 'react-native-firebase';
import StatusScreen from './screens/StatusScreen';
import HistoryScreen from './screens/HistoryScreen';
import DrawerComponent from './screens/DrawerComponent';
import SettingsScreen from './screens/SettingsScreen';


// Firestore connection
const ref = firebase.firestore();

// Screen size
const { width } = Dimensions.get('window');

const routeConfigs = {
  Status: {
    path: '/',
    screen: props => <StatusScreen {...props} firestoreRef={ref} />,
    navigationOptions: {
      drawerIcon: () => (
        <Icon name="sync" size={24} />
      ),
    },
  },
  History: {
    path: '/history',
    screen: props => <HistoryScreen {...props} firestoreRef={ref} />,
    navigationOptions: {
      drawerIcon: () => (
        <Icon name="history" size={24} />
      ),
    },
  },
  Settings: {
    path: '/settings',
    screen: props => <SettingsScreen {...props} firestoreRef={ref} />,
    navigationOptions: {
      drawerIcon: () => (
        <Icon name="settings" size={24} />
      ),
    },
  },
};


const drawerNavigatorConfig = {
  initialRouteName: 'Status',
  drawerWidth: width / 2,
  drawerPosition: 'left',
  order: ['Status', 'History', 'Settings'],
  contentOptions: {
    itemsContainerStyle: {
      // marginVertical: 100,
    },
    labelStyle: {
      fontSize: 18,
    },
  },
  contentComponent: DrawerComponent,
};

const MyDrawerNavigator = createDrawerNavigator(routeConfigs, drawerNavigatorConfig);
export default createAppContainer(MyDrawerNavigator);