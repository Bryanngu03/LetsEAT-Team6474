// screens/PostScreen.js
import React, { Component } from 'react';
import { View, Text, Button, Image, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { firebase } from '../firebase';

export default class PostScreen extends Component {
  state = {
    text: "",
    image: null,
  };

  componentDidMount() {
    this.getPhotoPermission();
  }

  getPhotoPermission = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    } catch (error) {
      console.error('Error requesting photo permissions:', error);
    }
  };

  pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        this.setState({ image: result.uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Post</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Want to share something?"
            style={styles.textInput}
            multiline
            onChangeText={(text) => this.setState({ text })}
            value={this.state.text}
          />
          <TouchableOpacity onPress={this.pickImage}>
            <Ionicons name="camera-outline" size={30} color="gray" />
          </TouchableOpacity>
        </View>
        {this.state.image && (
          <Image source={{ uri: this.state.image }} style={styles.image} />
        )}
        <Button title="Post" onPress={() => console.log('Post button pressed')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 16,
  },
});
