/*
Temperature Item
Used in Flat List to show Firestore documents
*/
import React from 'react';
import Moment from 'moment';
import { ListItem } from 'react-native-elements';
import { Image } from 'react-native';
import PropTypes from 'prop-types';
import images from '../res/images';

export default function TemperatureItem({ item }) {
  const { id, data } = item;
  const imageSrc = data.poweredOn ? images.greenLed : images.redLed;
  return (
    <ListItem
      key={id}
      title={`${data.celsius.toFixed(1)}°C`}
      subtitle={`Last update ${Moment(data.updatedAt).format('DD MMM HH:mm')}`}
      leftIcon={<Image source={imageSrc} style={{ height: 32, width: 32, marginRight: 14 }} />}
      hideChevron
    />
  );
}

TemperatureItem.propTypes = {
  item: PropTypes.object.isRequired,
};