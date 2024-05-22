// screens/LoadingScreen.js
/*import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../firebase';

const LoadingScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('User is authenticated, navigating to Home');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        console.log('User is not authenticated, navigating to Auth');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Auth', params: { screen: 'Login' } }],
        });
      }
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;*/

// screens/LoadingScreen.js
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../firebase';

const LoadingScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('User is authenticated, navigating to Home');
        navigation.navigate('Home');
      } else {
        console.log('User is not authenticated, navigating to Auth/Login');
        navigation.navigate('Auth');
      }
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;
