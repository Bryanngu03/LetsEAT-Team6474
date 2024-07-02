import React from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import AuthNavigator from './navigation/AuthNavigator';

const App = () => {
  return (
    <MenuProvider>
      <AuthNavigator />
    </MenuProvider>
  );
};

export default App;
