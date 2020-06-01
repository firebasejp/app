import React from 'react';
import { View, StatusBar } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Appbar, Title, useTheme } from 'react-native-paper';

const Dummy = ({ text }: { text: string }) => () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Title>{text}</Title>
  </View>
);

const Tab = createMaterialTopTabNavigator();

export function NewsNavigator(): JSX.Element {
  const theme = useTheme();

  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={!theme.dark ? 'dark-content' : 'light-content'}
      />
      <Appbar.Header
        style={{
          backgroundColor: theme.dark ? theme.colors.background : '#FFFFFF',
          elevation: 0,
        }}
      >
        {/* <Appbar.Action icon="magnify" onPress={() => ({})} /> */}
        <Appbar.Content title="Firebase Japan User Group" />
      </Appbar.Header>
      <Tab.Navigator
        initialRouteName="/news/events"
        tabBarOptions={{
          tabStyle: { width: 100 },
          scrollEnabled: true,
          showIcon: true,
        }}
      >
        <Tab.Screen
          name="/news/favorite"
          component={Dummy({ text: 'Favorite' })}
          options={{
            tabBarLabel: 'Favorite',
          }}
        />
        <Tab.Screen
          name="/news/events"
          component={Dummy({ text: 'Events' })}
          options={{
            tabBarLabel: 'Events',
          }}
        />
        <Tab.Screen
          name="/news/videos"
          component={Dummy({ text: 'Videos' })}
          options={{
            tabBarLabel: 'Videos',
          }}
        />
        <Tab.Screen
          name="/news/blog"
          component={Dummy({ text: 'Blog' })}
          options={{
            tabBarLabel: 'Blog',
          }}
        />
        <Tab.Screen
          name="/news/who-use"
          component={Dummy({ text: 'Who use' })}
          options={{
            tabBarLabel: 'Who use',
          }}
        />
      </Tab.Navigator>
    </>
  );
}
