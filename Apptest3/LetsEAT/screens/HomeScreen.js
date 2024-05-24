import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { db } from '../firebase';

const HomeScreen = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsRef = db.collection('posts');
                postsRef.onSnapshot(querySnapshot => {
                    const posts = [];
                    querySnapshot.forEach(doc => {
                        const data = doc.data();
                        const post = {
                            id: doc.id,
                            image: data.image || '',
                            text: data.text || '',
                            timestamp: data.timestamp || 0,
                            uid: data.uid || ''
                        };
                        posts.push(post);
                    });
                    console.log('Fetched posts: ', posts); 
                    setPosts(posts);
                    setLoading(false);
                });
            } catch (error) {
                console.error('Error fetching posts: ', error);
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const renderPost = ({ item }) => {
        return (
            <View style={styles.feedItem}>
                <Image source={require('../assets/tempAvatar.jpg')} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                            <Text style={styles.name}>{item.uid}</Text>
                            <Text style={styles.timestamp}>{moment(item.timestamp).fromNow()}</Text>
                        </View>
                        <Ionicons name='ellipsis-horizontal' size={24} color='#73788B' />
                    </View>
                    <Text style={styles.post}>{item.text}</Text>
                    {item.image ? (
                        <Image source={{ uri: item.image }} style={styles.postImage} resizeMode='cover' />
                    ) : null}
                    <View style={{ flexDirection: 'row' }}>
                        <Ionicons name='heart-outline' size={24} color='#73788B' style={{ marginRight: 16 }} />
                        <Ionicons name='chatbox-outline' size={24} color='#73788B' />
                    </View>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='#0000ff' />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Feed</Text>
            </View>
            <FlatList
                style={styles.feed}
                data={posts}
                renderItem={renderPost}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EBECF4'
    },
    header: {
        paddingTop: 16,
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
    headerTitle: {
        fontSize: 20,
        fontWeight: '500'
    },
    feed: {
        marginHorizontal: 16
    },
    feedItem: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        padding: 8,
        flexDirection: 'row',
        marginVertical: 8
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 16
    },
    name: {
        fontSize: 15,
        fontWeight: '500',
        color: '#454D65'
    },
    timestamp: {
        fontSize: 11,
        color: '#C4C6CE',
        marginTop: 4
    },
    post: {
        marginTop: 16,
        fontSize: 14,
        color: '#838899'
    },
    postImage: {
        width: undefined,
        height: 150,
        borderRadius: 5,
        marginVertical: 16
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default HomeScreen;
