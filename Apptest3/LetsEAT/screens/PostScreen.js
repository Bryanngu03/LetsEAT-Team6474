import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Image, Alert } from 'react-native';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Fire from '../Fire';
import { firebase } from '../firebase';

export default class PostScreen extends React.Component {
    state = {
        text: '',
        image: null,
    };

    componentDidMount() {
        this.getPhotoPermission();
    }

    getPhotoPermission = async () => {
        if (Constants.platform.ios) {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("We need permission to use your camera roll if you'd like to include a photo.");
            }
        }
    };

    handlePost = () => {
        if (!this.state.image) {
            Alert.alert("No image selected");
            return;
        }

        Fire.shared
            .addPost({ text: this.state.text.trim(), localUri: this.state.image })
            .then(ref => {
                this.setState({ text: '', image: null });
                this.props.navigation.goBack();
            })
            .catch(error => {
                Alert.alert(error.message);
            });
    };

    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
        });

        console.log('Image picker result: ', result);

        if (!result.cancelled) {
            // Access the URI correctly from the result object
            const uri = result.assets && result.assets.length > 0 ? result.assets[0].uri : result.uri;
            this.setState({ image: uri });
            console.log('Image URI: ', uri);
        }
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#D8D9DB" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.handlePost}>
                        <Text style={{ fontWeight: '500' }}>Post</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Image source={require('../assets/tempAvatar.jpg')} style={styles.avatar} />
                    <TextInput
                        autoFocus
                        multiline
                        numberOfLines={4}
                        style={{ flex: 1 }}
                        placeholder="Want to share something?"
                        onChangeText={text => this.setState({ text })}
                        value={this.state.text}
                    />
                </View>

                <TouchableOpacity style={styles.photo} onPress={this.pickImage}>
                    <Ionicons name="camera" size={32} color="#D8D9DB" />
                </TouchableOpacity>

                <View style={{ marginHorizontal: 32, marginTop: 32, height: 150 }}>
                    {this.state.image && <Image source={{ uri: this.state.image }} style={{ width: '100%', height: '100%' }} />}
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#D8D9DB',
    },
    inputContainer: {
        margin: 32,
        flexDirection: 'row',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16,
    },
    photo: {
        alignItems: 'flex-end',
        marginHorizontal: 32,
    },
});
