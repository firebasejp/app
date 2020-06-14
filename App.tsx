import React from 'react';
import { I18nManager } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import {
  Provider as PaperProvider,
  DefaultTheme as PaperTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import { Updates } from 'expo';
import { auth, UserContext } from './lib/firebase';
import * as SplashScreen from 'expo-splash-screen';
import {
  PreferencesContext,
  PreferencesContextType,
} from './context/preferences';
import { RootNabigator } from './components/navigator';

export default function App(): JSX.Element {
  const [user, setUser] = React.useState(auth.currentUser);
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

  React.useEffect(() => {
    // TODO(k2wanko): Implement loading
    SplashScreen.preventAutoHideAsync();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      SplashScreen.hideAsync();
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  });

  return (
    <>
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
              <UserContext.Provider value={user}>
                <RootNabigator />
              </UserContext.Provider>
            </PaperProvider>
          </PreferencesContext.Provider>
        </AppearanceProvider>
      </SafeAreaProvider>
    </>
  );
}
