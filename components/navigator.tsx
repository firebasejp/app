import React from 'react';
import {
  NavigationContainer,
  LinkingOptions,
  NavigationState,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { PartialState } from '@react-navigation/routers';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useTheme } from 'react-native-paper';
import {
  MaterialIcons,
  Feather,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { NewsNavigator } from './news';
import { Notifications } from './notifications';
import { MyPage } from './profile';
import { Settings } from './settings';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const getActiveRoute = (
  state: NavigationState | PartialState<NavigationState>,
): { name: string; params?: unknown } | null => {
  if (!state) {
    return null;
  }
  const route = state.routes[state.index ?? 0];

  const routeState = route.state;
  if (routeState) {
    return getActiveRoute(routeState);
  }

  route.params;

  return {
    name: route.name,
    params: route.params,
  };
};

export function RootNabigator(): JSX.Element {
  const theme = useTheme();
  const navigationTheme = theme.dark
    ? { ...DarkTheme, colors: { ...DarkTheme.colors, primary: '#ffab40' } }
    : {
        ...DefaultTheme,
        colors: { ...DefaultTheme.colors, primary: '#ffab40' },
      };

  const linking: LinkingOptions = {
    prefixes: ['https://firebase.asia'],
  };

  const Top = (): JSX.Element => (
    <Tab.Navigator
      theme={navigationTheme}
      initialRouteName="/news"
      barStyle={{ backgroundColor: theme.colors.surface }}
    >
      <Tab.Screen
        name="/news"
        component={NewsNavigator}
        options={{
          tabBarLabel: 'News',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="computer" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="/notification"
        component={Notifications}
        options={{
          tabBarBadge: true,
          tabBarLabel: 'Notification',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="bell-outline"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="/my"
        component={MyPage}
        options={{
          tabBarLabel: 'My page',
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );

  return (
    <NavigationContainer
      onStateChange={(state) => {
        if (!state) {
          return;
        }
        const { name: currentRouteName } = getActiveRoute(state) ?? {};
        console.log({ currentRouteName });

        // Analytics.setCurrentScreen(currentRouteName);
      }}
      theme={navigationTheme}
      linking={linking}
    >
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="/" component={Top} />
        <Stack.Screen name="/settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
