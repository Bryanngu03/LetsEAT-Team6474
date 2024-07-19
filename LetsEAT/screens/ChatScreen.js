import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { firebase } from '../firebase';
import { Ionicons } from '@expo/vector-icons';

const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const route = useRoute();
    const navigation = useNavigation();
    const { user } = route.params;
    const currentUser = firebase.auth().currentUser;

    useEffect(() => {
        const chatId = currentUser.uid < user.id ? `${currentUser.uid}_${user.id}` : `${user.id}_${currentUser.uid}`;

        const unsubscribe = firebase.firestore()
            .collection('chats')
            .doc(chatId)
            .collection('messages')
            .orderBy('timestamp', 'asc')
            .onSnapshot(snapshot => {
                const messagesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMessages(messagesList);
            });

        return unsubscribe;
    }, [user.id, currentUser.uid]);

    const sendMessage = async () => {
        if (text.trim() === '') return;

        setSending(true);

        const chatId = currentUser.uid < user.id ? `${currentUser.uid}_${user.id}` : `${user.id}_${currentUser.uid}`;

        const messageData = {
            text,
            sender: currentUser.uid,
            receiver: user.id,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        };

        const chatDocRef = firebase.firestore().collection('chats').doc(chatId);
        const chatDoc = await chatDocRef.get();

        if (!chatDoc.exists) {
            await chatDocRef.set({
                participants: [currentUser.uid, user.id],
                latestMessage: text,
                latestMessageTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
        } else {
            await chatDocRef.update({
                latestMessage: text,
                latestMessageTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
        }

        await chatDocRef.collection('messages').add(messageData);

        setText('');
        setSending(false);
    };

    const renderItem = useCallback(({ item }) => (
        <View style={[styles.messageItem, item.sender === currentUser.uid ? styles.myMessage : styles.otherMessage]}>
            <Text>{item.text}</Text>
            <Text style={styles.timestamp}>{item.timestamp?.toDate ? new Date(item.timestamp.toDate()).toLocaleString() : ''}</Text>
        </View>
    ), [currentUser.uid]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{user.name}</Text>
            </View>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                style={styles.messageList}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message"
                    value={text}
                    onChangeText={setText}
                    editable={!sending}
                />
                <TouchableOpacity onPress={sendMessage} disabled={sending}>
                    {sending ? (
                        <ActivityIndicator size="small" color="#73788B" />
                    ) : (
                        <Ionicons name='send' size={24} color='#73788B' />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E9446A', 
        padding: 10,
        paddingTop: 20, 
    },
    headerTitle: {
        marginLeft: 10,
        fontSize: 18,
        color: 'white',
    },
    messageList: {
        flex: 1,
    },
    messageItem: {
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        marginHorizontal: 10,
        maxWidth: '70%',
    },
    myMessage: {
        backgroundColor: '#DCF8C6',
        alignSelf: 'flex-end',
    },
    otherMessage: {
        backgroundColor: '#ECECEC',
        alignSelf: 'flex-start',
    },
    timestamp: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    input: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
});

export default ChatScreen;
