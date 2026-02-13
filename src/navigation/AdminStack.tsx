import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from 'src/config';
import { AdminDashboardScreen } from 'src/screens/admin/AdminDashboardScreen';
import { SevaManagementScreen } from 'src/screens/admin/SevaManagementScreen';
import { SevaFormScreen } from 'src/screens/admin/SevaFormScreen';
import { GuruManagementScreen } from 'src/screens/admin/GuruManagementScreen';
import { GuruFormScreen } from 'src/screens/admin/GuruFormScreen';
import { AdminProvider } from 'src/context/AdminContext'; // ✅ ADD THIS
import { EventManagementScreen } from 'src/screens/admin/EventManagementScreen';
import { EventFormScreen } from 'src/screens/admin/EventFormScreen';
import { MediaManagementScreen } from 'src/screens/admin/MediaManagementScreen';

const Stack = createNativeStackNavigator();

export const AdminStack = () => {
  return (
    <AdminProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name={ROUTES.SERVICES.ADMIN}
          component={AdminDashboardScreen}
        />
        <Stack.Screen
          name={ROUTES.SERVICES.SEVA_MANAGEMENT}
          component={SevaManagementScreen}
        />
        <Stack.Screen
          name={ROUTES.SERVICES.SEVA_FORM}
          component={SevaFormScreen}
        />
        <Stack.Screen
          name={ROUTES.SERVICES.GURU_MANAGEMENT}
          component={GuruManagementScreen}
        />
        <Stack.Screen
          name={ROUTES.SERVICES.GURU_FORM}
          component={GuruFormScreen}
        />
        <Stack.Screen
          name={ROUTES.SERVICES.EVENT_MANAGEMENT}
          component={EventManagementScreen}
        />
        <Stack.Screen
          name={ROUTES.SERVICES.EVENT_FORM}
          component={EventFormScreen}
        />
        <Stack.Screen
          name={ROUTES.SERVICES.MEDIA_MANAGEMENT}
          component={MediaManagementScreen}
        />
      </Stack.Navigator>
    </AdminProvider>
  );
};
