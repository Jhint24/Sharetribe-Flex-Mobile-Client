import {
  compose,
  hoistStatics,
  withStateHandlers,
  lifecycle,
  withHandlers,
  defaultProps,
  withPropsOnChange,
} from 'recompose';
import { inject } from 'mobx-react';
import uuid from 'uuid/v4';
import HomeScreenComponent from './HomeScreenView';
import { NavigationService } from '../../services';
import { categories as categoriesConstants } from '../../constants';
import { withDebounce } from '../../utils/enhancers';

const categories = categoriesConstants.map((item) => item.title);

const arrCoordinates = (value) => {
  const markers = value.reduce((acc, current) => {
    const body = {
      coordinate: {
        latitude: current.geolocation.lat,
        longitude: current.geolocation.lng,
      },
      cost: `${current.price.amount}`,
      key: uuid(),
    };
    acc.push(body);
    return acc;
  }, []);
  return markers;
};

export default hoistStatics(
  compose(
    inject((stores) => ({
      listings: stores.listings,
      markers: arrCoordinates(stores.listings.list.asArray),
      products: stores.listings.list.asArray,
      // searchListings: stores.listings.searchListings.asArray,
    })),

    defaultProps({
      categories: categoriesConstants,
    }),

    withStateHandlers(
      {
        selectedTabIndex: 0,
        selectedMarkerIndex: 0,
      },
      {
        onChangeTabIndex: () => (index) => ({
          selectedTabIndex: index,
        }),
      },
    ),

    withStateHandlers(
      {
        category: '',
        subCategory: '',
        isRefreshing: false,
      },
      {
        onChange: () => (field, value) => ({
          [field]: value,
        }),

        chooseCategory: () => (category, subCategory) => ({
          category,
          subCategory,
        }),
      },
    ),

    withStateHandlers(
      {
        search: '',
      },
      {
        onChangeSearch: () => (search) => {
          return {
            search,
          };
        },
      },
    ),

    withHandlers({
      goToCategory: (props) => ({
        onlyCategory,
        showAllCategoriesButton,
        showCategoriesAsButton,
      }) => {
        NavigationService.navigateToCategory({
          onlyCategory,
          showAllCategoriesButton,
          showCategoriesAsButton,
          chooseCategory: (category, subCategory) => {
            props.chooseCategory(category, subCategory);
            NavigationService.goBack();
            props.onChangeSearch('');
          },
        });
      },

      getListingsBySearch: (props) => (title) => {
        props.listings.searchListings.run({
          title,
          categories,
        });
      },

      fetchAllListings: (props) => async () => {
        props.onChange('isRefreshing', true);

        await props.listings.fetchListings.run({
          categories: props.category || categories,
          subCategories: props.subCategory,
        });

        props.onChange('isRefreshing', false);
      },
    }),

    withDebounce('getListingsBySearch', 300),

    lifecycle({
      componentDidMount() {
        this.props.navigation.setParams({
          onChangeSearch: this.props.onChangeSearch,
          value: this.props.search,
        });
      },
    }),

    withPropsOnChange(['category', 'subCategory'], (props) => {
      props.listings.fetchListings.run({
        categories: props.category || categories,
        subCategories: props.subCategory,
      });

      props.onChangeSearch('');
    }),

    withPropsOnChange(['search'], (props) => {
      props.getListingsBySearch(props.search);
      props.navigation.setParams({
        value: props.search,
      });
    }),


  ),
)(HomeScreenComponent);
