import React from 'react';
import { DrawerItems } from 'react-navigation';
import {
  StyleSheet, SafeAreaView, ScrollView, Dimensions, View,
} from 'react-native';
import Image from 'react-native-scalable-image';

import images from '../res/images';

export default function DrawerComponent(props) {
  return (
    <ScrollView>
      <View style={styles.imageView}>
        <Image
          source={images.gopher}
          style={styles.image}
          width={Dimensions.get('window').width / 3}
        />
      </View>
      <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
        <DrawerItems {...props} />
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginTop: 10,
  },
});