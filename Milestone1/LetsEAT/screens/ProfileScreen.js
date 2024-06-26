//ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { firebase } from '../firebase';
import Fire from '../Fire'; // Ensure Fire is imported correctly

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = firebase.auth().currentUser?.uid;

        if (!userId) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        const userDoc = await firebase.firestore().collection('users').doc(userId).get();
        if (userDoc.exists) {
          setUser(userDoc.data());
        } else {
          setError('No such user document!');
        }
      } catch (err) {
        setError('Error fetching user data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    Fire.shared.signOut();
    Alert.alert('Logged out', 'You have been logged out successfully.', [
      { text: 'OK', onPress: () => navigation.navigate('Login') }
    ]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user.avatar ? (
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
      ) : (
        <View style={styles.placeholder}>
          <Text>No Avatar</Text>
        </View>
      )}
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
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
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  name: {
    fontSize: 20,
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    marginTop: 5,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#E9446A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#FFF',
    fontWeight: '500',
  },
});

export default ProfileScreen;