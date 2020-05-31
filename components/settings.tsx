import React from 'react';
import {
  Appbar,
  List,
  Portal,
  Dialog,
  Button,
  RadioButton,
} from 'react-native-paper';
import { useTheme, useNavigation } from '@react-navigation/native';
import { PreferencesContext } from '../context/preferences';

export function Settings(): JSX.Element {
  const [showThemeSettingDialog, setThemeSettingDialog] = React.useState(false);
  const theme = useTheme();
  const navigation = useNavigation();
  const { theme: preferencesTheme, toggleTheme } = React.useContext(
    PreferencesContext,
  );

  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: theme.colors.background,
          elevation: 0,
        }}
      >
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title="Settings" />
      </Appbar.Header>
      <List.Section>
        <List.Subheader>Settings</List.Subheader>
        <List.Item
          title="Theme"
          description={preferencesTheme == 'dark' ? 'Dark' : 'Light'}
          onPress={() => setThemeSettingDialog(true)}
        />
        <Portal>
          <Dialog
            visible={showThemeSettingDialog}
            onDismiss={() => setThemeSettingDialog(false)}
          >
            <Dialog.Title>Dark mode</Dialog.Title>
            <Dialog.Content>
              <RadioButton.Group
                onValueChange={() => toggleTheme()}
                value={preferencesTheme == 'dark' ? 'dark' : 'light'}
              >
                <RadioButton.Item label="Light" value="light" />
                <RadioButton.Item label="Dark" value="dark" />
              </RadioButton.Group>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setThemeSettingDialog(false)}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <List.Subheader>Other</List.Subheader>
        <List.Item title="Terms of service" />
        <List.Item title="Privacy policy" />
        <List.Item title="Analytics usage" />
        <List.Item title="Licenses notation" />
        <List.Item title="Version" description="1.0.0" />
      </List.Section>
    </>
  );
}
