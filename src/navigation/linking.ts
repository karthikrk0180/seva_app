import { LinkingOptions } from '@react-navigation/native';

export const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: ['https://sode.org', 'sodeapp://'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Otp: 'otp',
        },
      },
      Main: {
        screens: {
          Home: 'home',
          History: {
            screens: {
                GuruList: 'gurus',
                GuruDetail: 'gurus/:id'
            }
          },
          Seva: {
            screens: {
                SevaList: 'sevas',
                SevaBooking: 'sevas/book/:id'
            }
          },
          Profile: 'profile',
          More: 'more',
        },
      },
    },
  },
};
