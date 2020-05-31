import React from 'react';
import { View } from 'react-native';
import { Appbar, Title } from 'react-native-paper';
import { useTheme, useNavigation } from '@react-navigation/native';

export function MyPage(): JSX.Element {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: theme.colors.background,
          elevation: 0,
        }}
      >
        <Appbar.Content title="" />
        <Appbar.Action
          icon="settings-outline"
          onPress={() => {
            navigation.navigate('/settings');
          }}
        />
      </Appbar.Header>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Title>My Page</Title>
      </View>
    </>
  );
}
