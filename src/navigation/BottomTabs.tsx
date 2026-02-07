import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { HomeScreen } from 'src/screens/home/HomeScreen';
import { GuruListScreen } from 'src/screens/history/GuruListScreen';
import { GuruDetailScreen } from 'src/screens/history/GuruDetailScreen';
import { SevaListScreen } from 'src/screens/seva/SevaListScreen';
import { SevaBookingScreen } from 'src/screens/seva/SevaBookingScreen';
import { ProfileScreen } from 'src/screens/profile/ProfileScreen';
import { MoreScreen } from 'src/screens/more/MoreScreen';
import { RoomBookingScreen } from 'src/screens/booking/RoomBookingScreen';
import { EventListScreen } from 'src/screens/events/EventListScreen';
import { ROUTES } from 'src/config';

// -- History Stack --
export type HistoryStackParamList = {
  [ROUTES.HISTORY.GURU_LIST]: undefined;
  [ROUTES.HISTORY.GURU_DETAIL]: { id: string };
};
const HistoryStackNav = createNativeStackNavigator<HistoryStackParamList>();
const HistoryStack = () => (
  <HistoryStackNav.Navigator>
    <HistoryStackNav.Screen name={ROUTES.HISTORY.GURU_LIST} component={GuruListScreen} options={{ title: 'Parampara' }} />
    <HistoryStackNav.Screen name={ROUTES.HISTORY.GURU_DETAIL} component={GuruDetailScreen} options={{ title: 'Guru Details' }} />
  </HistoryStackNav.Navigator>
);

// -- Seva Stack --
export type SevaStackParamList = {
  [ROUTES.SEVA.SEVA_LIST]: undefined;
  [ROUTES.SEVA.SEVA_BOOKING]: { sevaId: string };
};
const SevaStackNav = createNativeStackNavigator<SevaStackParamList>();
const SevaStack = () => (
  <SevaStackNav.Navigator>
    <SevaStackNav.Screen name={ROUTES.SEVA.SEVA_LIST} component={SevaListScreen} options={{ title: 'Sevas' }} />
    <SevaStackNav.Screen name={ROUTES.SEVA.SEVA_BOOKING} component={SevaBookingScreen} options={{ title: 'Book Seva' }} />
  </SevaStackNav.Navigator>
);

// -- Home Stack --
export type HomeStackParamList = {
  [ROUTES.TABS.HOME]: undefined;
  [ROUTES.SERVICES.ROOM_BOOKING]: undefined;
  [ROUTES.SERVICES.EVENTS]: undefined;
};
const HomeStackNav = createNativeStackNavigator<HomeStackParamList>();
const HomeStack = () => (
    <HomeStackNav.Navigator>
        <HomeStackNav.Screen name={ROUTES.TABS.HOME} component={HomeScreen} options={{ headerShown: false }} />
        <HomeStackNav.Screen name={ROUTES.SERVICES.ROOM_BOOKING} component={RoomBookingScreen} options={{ title: 'Guest House' }} />
        <HomeStackNav.Screen name={ROUTES.SERVICES.EVENTS} component={EventListScreen} options={{ title: 'Events Calendar' }} />
    </HomeStackNav.Navigator>
);

// -- Bottom Tabs --
export type BottomTabParamList = {
  HomeStack: undefined; // Renamed to container
  [ROUTES.TABS.HISTORY]: undefined;
  [ROUTES.TABS.SEVA]: undefined;
  [ROUTES.TABS.PROFILE]: undefined;
  [ROUTES.TABS.MORE]: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const tabScreenOptions = (iconName: string) => ({
  tabBarIcon: ({ color, size }: { focused: boolean; color: string; size: number }) => (
    <MaterialIcons name={iconName as any} size={size} color={color} />
  ),
});

export const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#E65100',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: { paddingBottom: 4, minHeight: 56 },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen name="HomeStack" component={HomeStack} options={{ tabBarLabel: 'Home', ...tabScreenOptions('home') }} />
      <Tab.Screen name={ROUTES.TABS.HISTORY} component={HistoryStack} options={{ tabBarLabel: 'History', ...tabScreenOptions('auto-stories') }} />
      <Tab.Screen name={ROUTES.TABS.SEVA} component={SevaStack} options={{ tabBarLabel: 'Seva', ...tabScreenOptions('volunteer-activism') }} />
      <Tab.Screen name={ROUTES.TABS.PROFILE} component={ProfileScreen} options={{ tabBarLabel: 'Profile', ...tabScreenOptions('person') }} />
      <Tab.Screen name={ROUTES.TABS.MORE} component={MoreScreen} options={{ tabBarLabel: 'More', ...tabScreenOptions('more-horiz') }} />
    </Tab.Navigator>
  );
};
