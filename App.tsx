import React from 'react';
import { I18nManager, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import {
  Provider as PaperProvider,
  DefaultTheme as PaperTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import { Updates } from 'expo';

import {
  PreferencesContext,
  PreferencesContextType,
} from './context/preferences';

import { RootNabigator } from './components/navigator';

export default function App(): JSX.Element {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = React.useState<'light' | 'dark'>(
    colorScheme === 'dark' ? 'dark' : 'light',
  );
  const [rtl] = React.useState<boolean>(I18nManager.isRTL);

  function toggleTheme() {
    setTheme((theme) => (theme === 'light' ? 'dark' : 'light'));
  }

  const toggleRTL = React.useCallback(() => {
    I18nManager.forceRTL(!rtl);
    Updates.reloadFromCache();
  }, [rtl]);

  const preferences = React.useMemo(
    (): PreferencesContextType => ({
      toggleTheme,
      toggleRTL,
      theme,
      rtl: rtl ? 'right' : 'left',
    }),
    [rtl, theme, toggleRTL],
  );

  return (
    <>
      <StatusBar
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
      />
      <SafeAreaProvider>
        <AppearanceProvider>
          <PreferencesContext.Provider value={preferences}>
            <PaperProvider
              theme={
                theme === 'light'
                  ? {
                      ...PaperTheme,
                      colors: { ...PaperTheme.colors, primary: '#ffab40' },
                    }
                  : {
                      ...PaperDarkTheme,
                      colors: { ...PaperDarkTheme.colors, primary: '#ffab40' },
                    }
              }
            >
              <RootNabigator />
            </PaperProvider>
          </PreferencesContext.Provider>
        </AppearanceProvider>
      </SafeAreaProvider>
    </>
  );
}