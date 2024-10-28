import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';

export type RootStackParamList = {
  Onboarding1: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  Login: undefined;
  TutorRegistration: undefined;
  StudentRegistration: undefined;
  TabLayout: undefined;
  Tutores: undefined;
  Home: undefined;
};

export type TabParamList = {
  Home: undefined;
  Messages: undefined;
  Profile: undefined;
  Tutores: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, T>,
    NativeStackScreenProps<RootStackParamList>['navigation']
  >;
};

export type OnboardingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Onboarding1"
>;
export type Onboarding2ScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Onboarding2"
>;
export type Onboarding3ScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Onboarding3"
>;
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Login">;
export type TutorRegistrationProps = NativeStackScreenProps<
  RootStackParamList,
  "TutorRegistration"
>;
export type StudentRegistrationProps = NativeStackScreenProps<
  RootStackParamList,
  "StudentRegistration"
>;

export type TabLayoutProps = NativeStackScreenProps<
  RootStackParamList,
  "TabLayout"
>;

export type TutoresScreenProps = TabScreenProps<'Tutores'>;
