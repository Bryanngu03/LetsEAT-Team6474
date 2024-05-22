// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { firebase } from '../firebase';

const HomeScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const { email, displayName } = firebase.auth().currentUser;
    setEmail(email);
    setDisplayName(displayName);
  }, []);

  const signOutUser = () => {
    firebase.auth().signOut().then(() => {
      navigation.navigate('Login');
    }).catch((error) => {
      alert(error.message);
    });
  };

  return (
    <View style={styles.container}>
      <Text>Hi {email}!</Text>
      <TouchableOpacity style={{ marginTop: 32 }} onPress={signOutUser}>
        <Text>Logout</Text>
      </TouchableOpacity>
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

export default HomeScreen;
