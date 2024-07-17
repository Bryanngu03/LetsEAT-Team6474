import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Clipboard, FlatList, RefreshControl, Dimensions, TextInput, Modal } from 'react-native';
import { firebase } from '../firebase';
import Fire from '../Fire';
import { Ionicons } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

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

  const confirmDelete = (id) => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Delete", onPress: () => deleteSavedPost(id) }
      ],
      { cancelable: false }
    );
  };

  const deleteSavedPost = async (id) => {
    try {
      await Fire.shared.deleteSavedPost(id);
      fetchSavedPosts(); 
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSavedPosts().then(() => setRefreshing(false));
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets && result.assets.length > 0 ? result.assets[0].uri : result.uri;
      const userId = firebase.auth().currentUser?.uid;
      const remoteUri = await Fire.shared.uploadPhotoAsync(uri, `avatars/${userId}`);
      await firebase.firestore().collection('users').doc(userId).update({ avatar: remoteUri });
      setUser({ ...user, avatar: remoteUri });
      Alert.alert('Success', 'Avatar updated successfully.');
    }
  };

  const resetPassword = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      try {
        await firebase.auth().sendPasswordResetEmail(user.email);
        Alert.alert('Success', 'Password reset email sent.');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  const handleSendFeedback = async () => {
    if (feedback.trim() === '') {
      Alert.alert('Error', 'Feedback cannot be empty.');
      return;
    }
    try {
      await Fire.shared.submitFeedback(feedback);
      Alert.alert('Success', 'Feedback sent successfully.');
      setModalVisible(false);
      setFeedback('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send feedback: ' + error.message);
    }
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

  const renderSavedPost = ({ item }) => (
    <View style={styles.savedPostItem}>
      <Image source={{ uri: item.image }} style={styles.savedPostImage} />
      <View style={{ flex: 1 }}>
        <Text style={styles.savedPostText}>{item.text}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item.id)}>
        <Ionicons name="close-circle-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabHeaderTitle}>Profile</Text>
        <Menu>
          <MenuTrigger>
            <Ionicons name="settings-outline" size={24} color="#333" />
          </MenuTrigger>
          <MenuOptions customStyles={menuOptionsStyles}>
            <MenuOption onSelect={pickImage} text="Switch Icon" />
            <MenuOption onSelect={resetPassword} text="Reset Password" />
            <MenuOption onSelect={() => setModalVisible(true)} text="Send Feedback" />
            <MenuOption onSelect={handleLogout} text="Log Out" />
          </MenuOptions>
        </Menu>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Send Feedback</Text>
            <TextInput
              style={styles.feedbackInput}
              placeholder="Type your feedback here..."
              value={feedback}
              onChangeText={setFeedback}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendFeedback}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const menuOptionsStyles = {
  optionsContainer: {
    padding: 10,
    width: 200,
  },
  optionWrapper: {
    padding: 10,
  },
  optionText: {
    fontSize: 16,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBECF4',
    alignItems: 'center',
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
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tabHeaderTitle: {
    fontSize: 20,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  settingsIcon: {
    position: 'absolute',
    right: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
    marginTop: 20,
  },
  name: {
    fontSize: 20,
    marginTop: 10,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
  },
  uidContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'center',
  },
  uid: {
    fontSize: 12,
    color: 'grey',
    textAlign: 'center',
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
  savedPostsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  savedPostItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: width - 20,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#EBECF4',
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
  deleteButton: {
    padding: 8,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  feedbackInput: {
    width: '100%',
    height: 100,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 5,
    marginBottom: 20,
    textAlignVertical: 'top', // For multiline input to align text at the top
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sendButton: {
    backgroundColor: '#E9446A',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  closeButton: {
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontSize: 16,
  },
});

export default ProfileScreen;
