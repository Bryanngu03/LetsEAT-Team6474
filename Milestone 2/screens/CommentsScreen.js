import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { db } from '../firebase';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import firebase from 'firebase/compat/app';

const CommentsScreen = ({ route, navigation }) => {
    const { postId } = route.params;
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchComments = async () => {
        try {
            const commentsRef = db.collection('posts').doc(postId).collection('comments').orderBy('timestamp', 'desc');
            commentsRef.onSnapshot(querySnapshot => {
                const comments = [];
                querySnapshot.forEach(doc => {
                    comments.push({ id: doc.id, ...doc.data() });
                });
                setComments(comments);
                setLoading(false);
            });
        } catch (error) {
            console.error('Error fetching comments: ', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const handleAddComment = async () => {
        if (comment.trim() === '') return;

        try {
            const user = firebase.auth().currentUser;
            const userDoc = await db.collection('users').doc(user.uid).get();
            const userData = userDoc.data();
            await db.collection('posts').doc(postId).collection('comments').add({
                text: comment,
                uid: user.uid,
                timestamp: Date.now(),
                name: userData.name,
                avatar: userData.avatar
            });
            await db.collection('posts').doc(postId).update({
                commentsCount: firebase.firestore.FieldValue.increment(1)
            });
            setComment('');
        } catch (error) {
            console.error('Error adding comment: ', error);
        }
    };

    const renderComment = ({ item }) => (
        <View style={styles.commentItem}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.timestamp}>{moment(item.timestamp).fromNow()}</Text>
                </View>
                <Text style={styles.commentText}>{item.text}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={comments}
                renderItem={renderComment}
                keyExtractor={item => item.id}
                style={styles.commentsList}
                ListEmptyComponent={<Text style={styles.noComments}>No comments yet</Text>}
            />
            <View style={styles.commentInputContainer}>
                <TextInput
                    style={styles.commentInput}
                    placeholder='Add a comment...'
                    value={comment}
                    onChangeText={setComment}
                />
                <TouchableOpacity onPress={handleAddComment}>
                    <Ionicons name='send' size={24} color='#73788B' />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    commentsList: {
        paddingHorizontal: 16,
    },
    commentItem: {
        flexDirection: 'row',
        marginVertical: 8,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 16,
    },
    name: {
        fontSize: 15,
        fontWeight: '500',
        color: '#454D65',
    },
    timestamp: {
        fontSize: 11,
        color: '#C4C6CE',
        marginTop: 4,
    },
    commentText: {
        marginTop: 4,
        fontSize: 14,
        color: '#838899',
    },
    noComments: {
        textAlign: 'center',
        marginTop: 20,
        color: '#838899',
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#EBECF4',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    commentInput: {
        flex: 1,
        marginRight: 8,
        height: 40,
        borderColor: '#EBECF4',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        backgroundColor: '#F8F9FA',
    },
});

export default CommentsScreen;
