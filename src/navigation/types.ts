import { NavigatorScreenParams } from '@react-navigation/native';
import { ROUTES } from 'src/config';

export type AuthStackParamList = {
  [ROUTES.AUTH.LOGIN]: undefined;
  [ROUTES.AUTH.OTP]: { phoneNumber: string; verificationId: string };
};

export type HistoryStackParamList = {
  [ROUTES.HISTORY.GURU_LIST]: undefined;
  [ROUTES.HISTORY.GURU_DETAIL]: { id: string };
};

export type SevaStackParamList = {
  [ROUTES.SEVA.SEVA_LIST]: undefined;
  [ROUTES.SEVA.SEVA_BOOKING]: { sevaId: string };
};

export type HomeStackParamList = {
  [ROUTES.TABS.HOME]: undefined;
  [ROUTES.SERVICES.ROOM_BOOKING]: undefined;
  [ROUTES.SERVICES.EVENTS]: undefined;
};

export type BottomTabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  [ROUTES.TABS.HISTORY]: NavigatorScreenParams<HistoryStackParamList>;
  [ROUTES.TABS.SEVA]: NavigatorScreenParams<SevaStackParamList>;
  [ROUTES.TABS.PROFILE]: undefined;
  [ROUTES.TABS.MORE]: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<BottomTabParamList>;
};
