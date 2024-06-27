import React from "react";
<<<<<<< HEAD
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Image, Alert, Linking, ScrollView } from "react-native";
=======
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Image, Alert } from "react-native";
>>>>>>> parent of 33209da (Implemented ADdd Reminder and Get Direction)
import { Ionicons } from "@expo/vector-icons";
import Fire from "../Fire";
import * as ImagePicker from "expo-image-picker";
import UserPermissions from "../utilities/UserPermissions";
import { db } from '../firebase';

export default class PostScreen extends React.Component {
    state = {
        text: "",
        image: null,
        user: {}
    };

    componentDidMount() {
        UserPermissions.getCameraPermission();
        this.fetchUser();
    }

    fetchUser = async () => {
        const uid = Fire.shared.uid;
        const userDoc = await db.collection('users').doc(uid).get();
        this.setState({ user: userDoc.data() });
    }

    handlePost = () => {
        if (!this.state.image) {
            Alert.alert("No image selected");
            return;
        }

        Fire.shared
<<<<<<< HEAD
            .addPost({
                text: this.state.text.trim(),
                localUri: this.state.image,
                likes: 0,
                commentsCount: 0,
                date: this.state.date.getTime(),
                locationLink: this.state.locationLink,
                locationName: this.state.locationName
=======
            .addPost({ 
                text: this.state.text.trim(), 
                localUri: this.state.image, 
                likes: 0, 
                commentsCount: 0 
>>>>>>> parent of 33209da (Implemented ADdd Reminder and Get Direction)
            })
            .then(ref => {
                this.setState({ text: "", image: null });
                this.props.navigation.goBack();
            })
            .catch(error => {
                Alert.alert(error.message);
            });
    };

    pickImage = async () => {
        UserPermissions.getCameraPermission();
        
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
        });

        if (!result.cancelled) {
            const uri = result.assets && result.assets.length > 0 ? result.assets[0].uri : result.uri;
            this.setState({ image: uri });
        }
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.tabHeader}>
                    <Text style={styles.tabHeaderTitle}>Post</Text>
                </View>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#D8D9DB"></Ionicons>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.handlePost}>
                        <Text style={{ fontWeight: "500" }}>Post</Text>
                    </TouchableOpacity>
                </View>

<<<<<<< HEAD
                <ScrollView>
                    <View style={styles.inputContainer}>
                        <Image source={this.state.user.avatar ? { uri: this.state.user.avatar } : require("../assets/tempAvatar2.jpg")} style={styles.avatar}></Image>
                        <TextInput
                            autoFocus={true}
                            multiline={true}
                            numberOfLines={4}
                            style={{ flex: 1 }}
                            placeholder="Want to share something?"
                            onChangeText={text => this.setState({ text })}
                            value={this.state.text}
                        ></TextInput>
                        <TouchableOpacity style={styles.photo} onPress={this.pickImage}>
                            <Ionicons name="camera" size={32} color="#D8D9DB"></Ionicons>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginHorizontal: 32, marginTop: 16, height: 200 }}>
                        {this.state.image && <Image source={{ uri: this.state.image }} style={{ width: "100%", height: "100%", resizeMode: 'contain' }}></Image>}
                    </View>

                    <View style={styles.extraInputContainer}>
                        <Text style={styles.label}>Date & Time</Text>
                        <View style={styles.dateTimeContainer}>
                            <TouchableOpacity style={styles.dateTimePicker} onPress={() => this.setState({ showDatePicker: true })}>
                                <Text>{this.state.date.toLocaleDateString()}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.dateTimePicker} onPress={() => this.setState({ showTimePicker: true })}>
                                <Text>{this.state.date.toLocaleTimeString()}</Text>
                            </TouchableOpacity>
                        </View>
                        {this.state.showDatePicker && (
                            <DateTimePicker
                                value={this.state.date}
                                mode="date"
                                display="default"
                                onChange={this.onDateChange}
                            />
                        )}
                        {this.state.showTimePicker && (
                            <DateTimePicker
                                value={this.state.date}
                                mode="time"
                                display="default"
                                onChange={this.onTimeChange}
                            />
                        )}
                        <Text style={styles.label}>Location</Text>
                        <TextInput
                            style={styles.locationNameInput}
                            placeholder="Enter Location Name"
                            onChangeText={locationName => this.setState({ locationName })}
                            value={this.state.locationName}
                        />
                        <View style={styles.locationContainer}>
                            <TextInput
                                style={styles.locationInput}
                                placeholder="Paste Google Maps link here"
                                onChangeText={locationLink => this.setState({ locationLink })}
                                value={this.state.locationLink}
                            />
                            <TouchableOpacity style={styles.findButton} onPress={this.openGoogleMaps}>
                                <Text style={styles.findButtonText}>Find</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
=======
                <View style={styles.inputContainer}>
                    <Image source={this.state.user.avatar ? { uri: this.state.user.avatar } : require("../assets/tempAvatar2.jpg")} style={styles.avatar}></Image>
                    <TextInput
                        autoFocus={true}
                        multiline={true}
                        numberOfLines={4}
                        style={{ flex: 1 }}
                        placeholder="Want to share something?"
                        onChangeText={text => this.setState({ text })}
                        value={this.state.text}
                    ></TextInput>
                </View>

                <TouchableOpacity style={styles.photo} onPress={this.pickImage}>
                    <Ionicons name="camera" size={32} color="#D8D9DB"></Ionicons>
                </TouchableOpacity>

                <View style={{ marginHorizontal: 32, marginTop: 32, height: 150 }}>
                    {this.state.image && <Image source={{ uri: this.state.image }} style={{ width: "100%", height: "100%" }}></Image>}
                </View>
>>>>>>> parent of 33209da (Implemented ADdd Reminder and Get Direction)
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
        zIndex: 10
    },
    tabHeaderTitle: {
        fontSize: 20,
        fontWeight: '500'
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#D8D9DB"
    },
    inputContainer: {
        margin: 32,
<<<<<<< HEAD
        flexDirection: "row",
        alignItems: "center" 
=======
        flexDirection: "row"
>>>>>>> parent of 33209da (Implemented ADdd Reminder and Get Direction)
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16
    },
    photo: {
<<<<<<< HEAD
        marginLeft: 16, 
    },
    extraInputContainer: {
        marginHorizontal: 32,
        marginTop: 16
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '600',
    },
    dateTimeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    dateTimePicker: {
        borderWidth: 1,
        borderColor: "#D8D9DB",
        padding: 8,
        borderRadius: 4,
        width: "48%",
        fontSize: 12 
    },
    locationNameInput: {
        borderWidth: 1,
        borderColor: "#D8D9DB",
        padding: 8,
        borderRadius: 4,
        marginBottom: 16,
        fontSize: 10
    },
    locationContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    locationInput: {
        borderWidth: 1,
        borderColor: "#D8D9DB",
        padding: 8,
        borderRadius: 4,
        width: "75%",
        fontSize: 10
    },
    findButton: {
        backgroundColor: "#2196F3",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center"
    },
    findButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14
=======
        alignItems: "flex-end",
        marginHorizontal: 32
>>>>>>> parent of 33209da (Implemented ADdd Reminder and Get Direction)
    }
});