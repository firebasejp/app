import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Analytics from 'expo-firebase-analytics';

export default function App(): JSX.Element {
  if (__DEV__) {
    Analytics.setDebugModeEnabled(true).catch((err) => {
      console.warn(err.message);
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>FJUG</Text>
      <Button
        title="click"
        onPress={() => {
          Analytics.logEvent('click', {
            test: true,
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
});
