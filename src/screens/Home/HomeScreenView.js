import React from 'react';
import { View, Dimensions } from 'react-native';
import T from 'prop-types';
import { TabView, SceneMap } from 'react-native-tab-view';
import s from './styles';
import { DrawerButton } from '../../components';
import { ListView, MapView, TabBar, SearchInput } from './components';
import i18n from '../../i18n';

const HomeScreen = ({
  onChangeTabIndex,
  tabRoutes,
  tabIndex,
  goToCategory,
  category,
  subCategory,
}) => (
  <View style={s.container}>
    <View>
      <TabView
        swipeEnabled={false}
        navigationState={{
          index: tabIndex,
          routes: tabRoutes,
        }}
        renderScene={SceneMap({
          listView: ListView,
          mapView: MapView,
        })}
        onIndexChange={(index) => onChangeTabIndex(index)}
        style={s.tabView}
        initialLayout={{
          width: Dimensions.get('window').width,
        }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            goToCategory={goToCategory}
            category={category}
            subCategory={subCategory}
          />
        )}
      />
    </View>
  </View>
);

HomeScreen.navigationOptions = ({ navigation }) => ({
  headerLeft: <DrawerButton />,
  headerTitle: (
    <SearchInput
      placeholder={`${i18n.t('home.search')}...`}
      value={navigation.getParam('value')}
      onChangeText={navigation.getParam('onChangeSearch')}
    />
  ),
});

HomeScreen.propTypes = {
  onChangeTabIndex: T.func,
  tabRoutes: T.array,
  tabIndex: T.number,
  goToCategory: T.func,
  category: T.string,
  subCategory: T.string,
};

export default HomeScreen;
