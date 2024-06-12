// screens/LoadingScreen.js
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { firebase } from '../firebase'; // Ensure this path is correct
import { useNavigation } from '@react-navigation/native';

export default function LoadingScreen() {
    const navigation = useNavigation();

    React.useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                navigation.replace('Home');
            } else {
                navigation.replace('Login');
            }
        });

        return unsubscribe; // Clean up subscription on unmount
    }, []);

    return (
        <View style={styles.container}>
            <Text>Loading...</Text>
            <ActivityIndicator size="large" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
