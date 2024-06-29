import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../firebase';
import { Ionicons } from '@expo/vector-icons';

const MessageListScreen = () => {
    const [users, setUsers] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    const fetchChats = useCallback(async () => {
        setRefreshing(true);
        const currentUser = firebase.auth().currentUser;
        const snapshot = await firebase.firestore()
            .collection('chats')
            .where('participants', 'array-contains', currentUser.uid)
            .orderBy('latestMessageTimestamp', 'desc')
            .get();

        const userListPromises = snapshot.docs.map(async doc => {
            const data = doc.data();
            const otherUserId = data.participants.find(id => id !== currentUser.uid);
            const userDoc = await firebase.firestore().collection('users').doc(otherUserId).get();
            return {
                ...userDoc.data(),
                id: otherUserId,
                latestMessage: data.latestMessage,
                latestMessageTimestamp: data.latestMessageTimestamp,
            };
        });

        const userList = await Promise.all(userListPromises);
        setUsers(userList);
        setRefreshing(false);
    }, []);

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    const timeAgo = (timestamp) => {
        if (!timestamp) return '';
        const now = new Date();
        const diffInSeconds = Math.floor((now - timestamp.toDate()) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} seconds ago`;
        } else if (diffInSeconds < 3600) {
            return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        } else if (diffInSeconds < 86400) {
            return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        } else {
            return `${Math.floor(diffInSeconds / 86400)} days ago`;
        }
    };

    const truncateText = (text, maxLength = 30) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabHeader}>
                <Text style={styles.tabHeaderTitle}>Messages</Text>
            </View>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.userItem} onPress={() => navigation.navigate('Chat', { user: item })}>
                        <Image source={{ uri: item.avatar }} style={styles.avatar} />
                        <View style={styles.textContainer}>
                            <Text style={styles.userName}>{item.name}</Text>
                            <Text style={styles.latestMessage}>{truncateText(item.latestMessage)}</Text>
                            <Text style={styles.timestamp}>{timeAgo(item.latestMessageTimestamp)}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={fetchChats}
                    />
                }
            />
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Search')}>
                <Ionicons name="person-add-outline" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EBECF4',
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
    },
    tabHeaderTitle: {
        fontSize: 20,
        fontWeight: '500',
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    textContainer: {
        marginLeft: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    latestMessage: {
        fontSize: 14,
        color: '#666',
    },
    timestamp: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
    },
    addButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: '#E9446A',
        padding: 16,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default MessageListScreen;
