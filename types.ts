// types.ts
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";

export type RootStackParamList = {
  Onboarding1: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;

  Login: undefined;
  TutorRegistration: undefined;
  StudentRegistration: undefined;
  TutorDetailsScreen: { tutorId: string };
  TabLayout: undefined;
  Tutores: undefined;
  NotificacionesScreen: undefined;
  Home: undefined;
  TutoriaDetails: { tutoriaId: string };
  Chat: { chatId: string, chatName: string };
};

export type TabParamList = {
  Home: undefined;
  Messages: undefined;
  Profile: undefined;
  Tutores: undefined;
  TutorDetailsScreen: { tutorId: string };
  Notifications: undefined;
  TutoriaDetails: { tutoriaId: string };
};

export type TutorStackParamList = {
  TutorHome: undefined;
  ScheduleConsulting: undefined;
  NotificacionesScreen: undefined;
  TutoriaDetails: { tutoriaId: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, T>,
    NativeStackScreenProps<RootStackParamList>["navigation"]
  >;
};

export type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "Profile">,
  NativeStackScreenProps<RootStackParamList>["navigation"]
>;

export interface ProfileScreenProps {
  onLogout: () => void;
}

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

// export type TabLayoutProps = NativeStackScreenProps<
//   RootStackParamList,
//   "TabLayout"
// >;

export type TutorDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "TutorDetailsScreen"
>;

export type NotificacionesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "NotificacionesScreen"
>;
export type TutoriaDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "TutoriaDetails"
>;

export type TutoresScreenProps = TabScreenProps<"Tutores">;

export interface TabLayoutProps
  extends NativeStackScreenProps<RootStackParamList, "TabLayout"> {
  onLogout: () => void;
  userRole: number | null;
}

