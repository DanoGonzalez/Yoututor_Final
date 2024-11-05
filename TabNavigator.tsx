import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Image } from 'react-native';
import HomeScreen from './components/tabsStudents/index';
import ProfileScreen from './components/tabsStudents/profile';
import MessagesScreen from './components/tabsStudents/messages';
import TutoresScreen from './components/tabsStudents/tutores';
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

interface TabLayoutProps {
  onLogout: () => void;
}

const ProfileScreenWrapper: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  return <ProfileScreen onLogout={onLogout} />;
};

export default function TabLayout({ onLogout }: TabLayoutProps) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconSource;
          switch (route.name) {
            case 'Messages':
              iconSource = require('./assets/icons/messageTab.png');
              break;
            case 'Home':
              iconSource = require('./assets/icons/homeTab.png');
              break;
            case 'Profile':
              iconSource = require('./assets/icons/userTab.png');
              break;
            default:
              iconSource = null;
          }

          return (
            <Image
              source={iconSource}
              style={[
                styles.icon,
                { tintColor: focused ? '#0078FF' : color },
                focused && styles.activeIconShadow,
              ]}
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: '#0078FF',
        tabBarInactiveTintColor: '#B0B0B0',
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: styles.tabBar,
      })}
    >
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" children={() => <ProfileScreenWrapper onLogout={onLogout} />} />
      <Tab.Screen name="Tutores" component={TutoresScreen} options={{ tabBarButton: () => null }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    height: 65,
    borderRadius: 30,
    backgroundColor: 'white', // Cambiar a blanco para evitar sombras extrañas
    shadowColor: '#000',
    shadowOpacity: 0.1, // Reducir la opacidad de la sombra
    shadowOffset: { width: 0, height: 5 }, // Ajustar la sombra para que no cubra todo el tab
    shadowRadius: 10, // Reducir el radio de la sombra
    elevation: 5,
    borderWidth: 0, // Eliminar el borde para evitar líneas horizontales
  },
  icon: {
    width: 30,
    height: 30, // Tamaño uniforme para todos los íconos
  },
  activeIconShadow: {
    shadowColor: '#0078FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
});