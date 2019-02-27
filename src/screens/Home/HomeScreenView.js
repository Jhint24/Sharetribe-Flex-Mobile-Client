import React from 'react';
import { View, Text } from 'react-native';
import T from 'prop-types';
import s from './styles';
import { Touchable } from '../../components';

const HomeScreen = ({ singOut }) => (
  <View style={s.container}>
    <Text>Home Screen</Text>
    <Text>There is a token</Text>
    <Touchable>
      <Text onPress={singOut}>LOGOUT</Text>
    </Touchable>
  </View>
);

HomeScreen.navigationOptions = () => ({
  title: 'Home',
});

HomeScreen.propTypes = {
  singOut: T.func.isRequired,
};

export default HomeScreen;