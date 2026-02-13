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
import { EventDetailScreen } from 'src/screens/events/EventDetailScreen';
import SearchScreen from 'src/screens/search/SearchScreen';
import { Event } from 'src/models/event.model';
import { AdminDashboardScreen } from 'src/screens/admin/AdminDashboardScreen';
import { SevaManagementScreen } from 'src/screens/admin/SevaManagementScreen';
import { SevaFormScreen } from 'src/screens/admin/SevaFormScreen';
import { GuruManagementScreen } from 'src/screens/admin/GuruManagementScreen';
import { GuruFormScreen } from 'src/screens/admin/GuruFormScreen';
import { MediaManagementScreen } from 'src/screens/admin/MediaManagementScreen';
import { ROUTES } from 'src/config';
import { useAuthStore } from 'src/store/auth.store';
import { useCartStore } from 'src/store/cart.store';
import { AdminProvider } from 'src/context/AdminContext';
import { CartScreen } from 'src/screens/cart/CartScreen';

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
  [ROUTES.SERVICES.SEARCH]: { initialQuery?: string };
  [ROUTES.SERVICES.ROOM_BOOKING]: undefined;
  [ROUTES.SERVICES.EVENTS]: undefined;
  [ROUTES.SERVICES.EVENT_DETAIL]: { event: Event };
};
const HomeStackNav = createNativeStackNavigator<HomeStackParamList>();
const HomeStack = () => (
  <HomeStackNav.Navigator>
    <HomeStackNav.Screen name={ROUTES.TABS.HOME} component={HomeScreen} options={{ headerShown: false }} />
    <HomeStackNav.Screen name={ROUTES.SERVICES.SEARCH} component={SearchScreen} options={{ title: 'Search' }} />
    <HomeStackNav.Screen name={ROUTES.SERVICES.ROOM_BOOKING} component={RoomBookingScreen} options={{ title: 'Guest House' }} />
    <HomeStackNav.Screen name={ROUTES.SERVICES.EVENTS} component={EventListScreen} options={{ title: 'Events Calendar' }} />
    <HomeStackNav.Screen name={ROUTES.SERVICES.EVENT_DETAIL} component={EventDetailScreen} options={{ title: 'Event Details' }} />
  </HomeStackNav.Navigator>
);

// -- Admin Stack --
export type AdminStackParamList = {
  [ROUTES.SERVICES.ADMIN]: undefined;
  [ROUTES.SERVICES.SEVA_MANAGEMENT]: undefined;
  SevaForm: { sevaId?: string };
  [ROUTES.SERVICES.GURU_MANAGEMENT]: undefined;
  [ROUTES.SERVICES.GURU_FORM]: { guruId?: string };
  [ROUTES.SERVICES.MEDIA_MANAGEMENT]: undefined;
};
const AdminStackNav = createNativeStackNavigator<AdminStackParamList>();
const AdminStack = () => (
  <AdminProvider>
    <AdminStackNav.Navigator>
      <AdminStackNav.Screen
        name={ROUTES.SERVICES.ADMIN}
        component={AdminDashboardScreen}
        options={{ title: 'Admin Panel' }}
      />
      <AdminStackNav.Screen
        name={ROUTES.SERVICES.SEVA_MANAGEMENT}
        component={SevaManagementScreen}
        options={{ title: 'Manage Sevas' }}
      />
      <AdminStackNav.Screen
        name="SevaForm"
        component={SevaFormScreen}
        options={({ route }) => ({ title: route.params?.sevaId ? 'Edit Seva' : 'Add Seva' })}
      />
      <AdminStackNav.Screen
        name={ROUTES.SERVICES.GURU_MANAGEMENT}
        component={GuruManagementScreen}
        options={{ title: 'Manage Gurus' }}
      />
      <AdminStackNav.Screen
        name={ROUTES.SERVICES.GURU_FORM}
        component={GuruFormScreen}
        options={({ route }) => ({ title: (route.params as any)?.guruId ? 'Edit Guru' : 'Add Guru' })}
      />
      <AdminStackNav.Screen
        name={ROUTES.SERVICES.MEDIA_MANAGEMENT}
        component={MediaManagementScreen}
        options={{ title: 'Media' }}
      />
    </AdminStackNav.Navigator>
  </AdminProvider>
);

// -- Bottom Tabs --
export type BottomTabParamList = {
  HomeStack: undefined; // Renamed to container
  [ROUTES.TABS.HISTORY]: undefined;
  [ROUTES.TABS.SEVA]: undefined;
  [ROUTES.TABS.CART]: undefined;
  [ROUTES.TABS.PROFILE]: undefined;
  [ROUTES.TABS.MORE]: undefined;
  AdminStack: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const tabIcon =
  (name: string) =>
    ({ color, size }: { color: string; size: number }) =>
      <MaterialIcons name={name as any} size={size} color={color} />;


const tabScreenOptions = (iconName: string) => ({
  tabBarIcon: ({ color, size }: { focused: boolean; color: string; size: number }) => (
    <MaterialIcons name={iconName as any} size={size} color={color} />
  ),
});

export const BottomTabs = () => {
  const { user } = useAuthStore();
  const { items } = useCartStore();
  const cartItemCount = items.length;

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
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: tabIcon('home'),
        }}
      />
      <Tab.Screen name={ROUTES.TABS.HISTORY} component={HistoryStack} options={{ tabBarLabel: 'History', ...tabScreenOptions('auto-stories') }} />
      <Tab.Screen name={ROUTES.TABS.SEVA} component={SevaStack} options={{ tabBarLabel: 'Seva', ...tabScreenOptions('volunteer-activism') }} />
      <Tab.Screen
        name={ROUTES.TABS.CART}
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          ...tabScreenOptions('shopping-cart'),
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined
        }}
      />
      <Tab.Screen name={ROUTES.TABS.PROFILE} component={ProfileScreen} options={{ tabBarLabel: 'Profile', ...tabScreenOptions('person') }} />
      <Tab.Screen name={ROUTES.TABS.MORE} component={MoreScreen} options={{ tabBarLabel: 'More', ...tabScreenOptions('more-horiz') }} />

      {(user?.role === 'admin' || user?.role === 'superadmin') && (
        <Tab.Screen
          name="AdminStack"
          component={AdminStack}
          options={{ tabBarLabel: 'Admin', ...tabScreenOptions('admin-panel-settings') }}
        />
      )}
    </Tab.Navigator>
  );
};
