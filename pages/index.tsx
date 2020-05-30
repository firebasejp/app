import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>FJUG</Text>
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
