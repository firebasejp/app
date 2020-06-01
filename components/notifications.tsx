import React from 'react';
import { View, StatusBar } from 'react-native';
import { Appbar, Title } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

export function Notifications(): JSX.Element {
  const theme = useTheme();

  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={!theme.dark ? 'dark-content' : 'light-content'}
      />
      <Appbar.Header
        style={{
          backgroundColor: theme.colors.background,
          elevation: 0,
        }}
      >
        <Appbar.Content title="" />
      </Appbar.Header>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <Title>Notifications</Title>
      </View>
    </>
  );
}
