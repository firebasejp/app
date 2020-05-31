import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Appbar, Title } from 'react-native-paper';

const Dummy = ({ text }: { text: string }) => () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Title>{text}</Title>
  </View>
);

const Tab = createMaterialTopTabNavigator();

export const NewsNavigator = (): JSX.Element => (
  <>
    <Appbar.Header>
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
        name="/news/items1"
        component={Dummy({ text: 'Items 1' })}
        options={{
          tabBarLabel: 'Items 1',
        }}
      />
      <Tab.Screen
        name="/news/items2"
        component={Dummy({ text: 'Items 2' })}
        options={{
          tabBarLabel: 'Items 2',
        }}
      />
      <Tab.Screen
        name="/news/items3"
        component={Dummy({ text: 'Items 3' })}
        options={{
          tabBarLabel: 'Items 3',
        }}
      />
    </Tab.Navigator>
  </>
);
