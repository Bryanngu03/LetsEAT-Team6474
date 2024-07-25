import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity, Modal, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { db } from '../firebase';
import firebase from 'firebase/compat/app';
import Fire from '../Fire';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

const HomeScreen = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [loadingLikes, setLoadingLikes] = useState({});

    const fetchPosts = async () => {
        try {
            const postsRef = db.collection('posts').orderBy('timestamp', 'desc');
            postsRef.onSnapshot(async querySnapshot => {
                const posts = [];
                const user = firebase.auth().currentUser;
                for (let doc of querySnapshot.docs) {
                    const data = doc.data();
                    const userRef = await db.collection('users').doc(data.uid).get();
                    const userData = userRef.data();
                    const post = {
                        id: doc.id,
                        image: data.image || '',
                        text: data.text || '',
                        timestamp: data.timestamp || 0,
                        date: data.date || null,
                        locationName: data.locationName || '',
                        locationLink: data.locationLink || '',
                        uid: data.uid || '',
                        name: userData ? userData.name : 'Unknown',
                        avatar: userData ? userData.avatar : '../assets/tempAvatar.jpg',
                        likes: data.likes || 0,
                        commentsCount: data.commentsCount || 0,
                        liked: false, // Track if the user has liked this post
                        saved: false  // Track if the user has saved this post
                    };

                    if (user) {
                        const likeRef = await db.collection('posts').doc(doc.id).collection('likes').doc(user.uid).get();
                        post.liked = likeRef.exists;

                        const savedRef = await db.collection('users').doc(user.uid).collection('savedPosts').doc(doc.id).get();
                        post.saved = savedRef.exists;
                    }

                    posts.push(post);
                }
                setPosts(posts);
                setLoading(false);
            });
        } catch (error) {
            console.error('Error fetching posts: ', error);
            setLoading(false);
        }
    };

    const handleLike = async (postId, liked) => {
        const user = firebase.auth().currentUser;
        if (!user) return;

        setLoadingLikes(prevState => ({ ...prevState, [postId]: true }));

        const likeRef = db.collection('posts').doc(postId).collection('likes').doc(user.uid);
        const postRef = db.collection('posts').doc(postId);

        try {
            if (liked) {
                await likeRef.delete();
                await postRef.update({ likes: firebase.firestore.FieldValue.increment(-1) });
            } else {
                await likeRef.set({ uid: user.uid });
                await postRef.update({ likes: firebase.firestore.FieldValue.increment(1) });
            }

            // Ensure the fetched posts data is in sync with the current like state
            fetchPosts();
        } catch (error) {
            console.error('Error handling like/unlike: ', error);
        } finally {
            setLoadingLikes(prevState => ({ ...prevState, [postId]: false }));
        }
    };

    const handleDelete = async (postId, postUid) => {
        const user = firebase.auth().currentUser;
        if (user.uid !== postUid) {
            Alert.alert("You can only delete your own posts");
            return;
        }
        try {
            const postRef = db.collection('posts').doc(postId);
            await postRef.delete();
            
            fetchPosts();
            setSelectedPost(null);
            setModalVisible(false);
        } catch (error) {
            Alert.alert("Error deleting post");
        }
    };

    const handleSave = async (postId, saved) => {
        const user = firebase.auth().currentUser;
        if (!user) return;

        const savedRef = db.collection('users').doc(user.uid).collection('savedPosts').doc(postId);

        if (saved) {
            await savedRef.delete();
        } else {
            await Fire.shared.savePost(postId);
        }

        fetchPosts();
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchPosts().then(() => setRefreshing(false));
    }, []);

    const openModal = (post) => {
        setSelectedPost(post);
        setModalVisible(true);
    };

    const addReminder = (post) => {
        setModalVisible(false);
        navigation.navigate('AddReminder', {
            postTitle: post.text,
            postDate: post.date
        });
    };

    const getDirection = (post) => {
        setModalVisible(false);
        openGoogleMaps(post.locationLink);
    };

    const openGoogleMaps = (link) => {
        if (typeof link === 'string' && link) {
            Linking.openURL(link).catch(err => console.error("Couldn't load page", err));
        } else {
            Alert.alert('Invalid URL', 'The provided link is not valid.');
        }
    };

    const renderPost = ({ item }) => {
        return (
            <View style={styles.feedItem}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.timestamp}>{moment(item.timestamp).fromNow()}</Text>
                            {item.locationName && <Text style={styles.location}>{item.locationName}</Text>}
                        </View>
                        <Menu>
                            <MenuTrigger>
                                <Ionicons name='ellipsis-horizontal' size={24} color='#73788B' />
                            </MenuTrigger>
                            <MenuOptions customStyles={menuOptionsStyles}>
                                <MenuOption onSelect={() => handleDelete(item.id, item.uid)} text="Delete" />
                                <MenuOption onSelect={() => addReminder(item)} text="Add Reminder" />
                                <MenuOption onSelect={() => getDirection(item)} text="Get Direction" />
                            </MenuOptions>
                        </Menu>
                    </View>
                    <Text style={styles.post}>{item.text}</Text>
                    {item.image ? (
                        <Image source={{ uri: item.image }} style={styles.postImage} resizeMode='cover' />
                    ) : null}
                    <Text style={styles.period}>Period: {moment(item.date).format('MM/DD/YYYY, h:mm:ss a')}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => handleLike(item.id, item.liked)} style={styles.iconContainer} disabled={loadingLikes[item.id]}>
                            <Ionicons name={item.liked ? 'heart' : 'heart-outline'} size={24} color={item.liked ? 'red' : '#73788B'} style={{ marginRight: 8 }} />
                            <Text>{item.likes}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Comments', { postId: item.id })} style={styles.iconContainer}>
                            <Ionicons name='chatbox-outline' size={24} color='#73788B' style={{ marginRight: 8 }} />
                            <Text>{item.commentsCount}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleSave(item.id, item.saved)} style={styles.iconContainer}>
                            <Ionicons name={item.saved ? 'bookmark' : 'bookmark-outline'} size={24} color={item.saved ? 'yellow' : '#73788B'} style={{ marginRight: 8 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openGoogleMaps(item.locationLink)} style={styles.iconContainer}>
                            <Ionicons name="navigate" size={24} color="#73788B" style={{ marginRight: 8 }} />
                        </TouchableOpacity>
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
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </View>
    );
};

const menuOptionsStyles = {
    optionsContainer: {
        padding: 10,
        width: 150,
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
        backgroundColor: '#EBECF4'
    },
    header: {
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
    date: {
        fontSize: 11,
        color: '#73788B',
        marginTop: 4
    },
    location: {
        fontSize: 11,
        color: '#73788B',
        marginTop: 4
    },
    post: {
        marginTop: 16,
        fontSize: 14,
        color: '#838899'
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 5,
        marginVertical: 16
    },
    period: {
        fontSize: 14,
        color: '#454D65',
        marginTop: 8,
        marginBottom: 8
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16
    },
});

export default HomeScreen;
