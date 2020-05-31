import React from 'react';
import { View } from 'react-native';
import { Appbar, Title } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

export function Notifications(): JSX.Element {
  const theme = useTheme();

  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: theme.colors.background,
          elevation: 0,
        }}
      >
        <Appbar.Content title="" />
      </Appbar.Header>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Title>Notifications</Title>
      </View>
    </>
  );
}
