// ProfileScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Clipboard, FlatList, RefreshControl, Dimensions } from 'react-native';
import { firebase } from '../firebase';
import Fire from '../Fire';

const { width } = Dimensions.get('window'); // Get the width of the screen

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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
          setUid(userId);
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
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    try {
      const userId = firebase.auth().currentUser?.uid;
      const snapshot = await firebase.firestore().collection('users').doc(userId).collection('savedPosts').orderBy('timestamp', 'desc').get();
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSavedPosts(posts);
    } catch (error) {
      setError('Error fetching saved posts: ' + error.message);
    }
  };

  const handleLogout = () => {
    Fire.shared.signOut();
    Alert.alert('Logged out', 'You have been logged out successfully.', [
      { text: 'OK', onPress: () => navigation.navigate('Login') }
    ]);
  };

  const copyToClipboard = () => {
    Clipboard.setString(uid);
    Alert.alert('Copied to Clipboard', 'User ID has been copied to clipboard.');
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSavedPosts().then(() => setRefreshing(false));
  }, []);

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

  const renderSavedPost = ({ item }) => (
    <View style={styles.savedPostItem}>
      <Image source={{ uri: item.image }} style={styles.savedPostImage} />
      <View style={{ flex: 1 }}>
        <Text style={styles.savedPostText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabHeaderTitle}>Profile</Text>
      </View>
      {user?.avatar ? (
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
      ) : (
        <View style={styles.placeholder}>
          <Text>No Avatar</Text>
        </View>
      )}
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <View style={styles.uidContainer}>
        <Text style={styles.uid}>User ID: {uid}</Text>
        <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
          <Text style={styles.copyButtonText}>Copy</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
      <FlatList
        data={savedPosts}
        renderItem={renderSavedPost}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => (
          <View>
            <Text style={styles.savedPostsHeader}>Saved Posts</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={{ width: '100%' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBECF4', // Match the background color of the whole tab
    alignItems: 'center', // Center align content
  },
  tabHeader: {
    paddingTop: 30,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EBECF4',
    shadowColor: '#454D65',
    shadowOffset: { height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10,
    width: '100%', // Ensure it spans the full width of the screen
  },
  tabHeaderTitle: {
    fontSize: 20,
    fontWeight: '500',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10, // Add margin to move the profile section down
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
    marginTop: 20, // Add margin to move the profile section down
  },
  name: {
    fontSize: 20,
    marginTop: 10,
    textAlign: 'center', // Center align the name
  },
  email: {
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center', // Center align the email
  },
  uidContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'center', // Center align the container
  },
  uid: {
    fontSize: 10,
    color: 'grey',
    textAlign: 'center', // Center align the UID
  },
  copyButton: {
    marginLeft: 10,
    backgroundColor: '#E9446A',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  copyButtonText: {
    color: '#FFF',
    fontSize: 10,
  },
  logoutButton: {
    marginTop: 12,
    backgroundColor: '#E9446A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#FFF',
    fontWeight: '500',
    textAlign: 'center', // Center align the logout button text
  },
  savedPostsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center', // Center align the header
  },
  savedPostItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: width - 20, // Adjust the width to take the whole screen minus some padding
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#EBECF4', // Match the background color of the whole tab
  },
  savedPostImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  savedPostText: {
    flex: 1,
    fontSize: 16,
  },
});

export default ProfileScreen;