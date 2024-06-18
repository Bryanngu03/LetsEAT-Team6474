import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../firebase';
import { Ionicons } from '@expo/vector-icons';

const SearchScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [searchType, setSearchType] = useState('name');
    const [results, setResults] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        if (searchText.trim() === '') {
            setResults([]);
            return;
        }

        const fetchUsers = async () => {
            let query;
            if (searchType === 'name') {
                query = firebase.firestore().collection('users').where('name', '==', searchText);
            } else if (searchType === 'id') {
                query = firebase.firestore().collection('users').where(firebase.firestore.FieldPath.documentId(), '==', searchText);
            }

            const snapshot = await query.get();
            const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setResults(usersList);
        };

        fetchUsers();
    }, [searchText, searchType]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Friends</Text>
            </View>
            <TextInput
                style={styles.searchInput}
                placeholder={`Search by ${searchType}`}
                value={searchText}
                onChangeText={setSearchText}
            />
            <View style={styles.tabContainer}>
                <TouchableOpacity style={[styles.tab, searchType === 'name' && styles.activeTab]} onPress={() => setSearchType('name')}>
                    <Text style={[styles.tabText, searchType === 'name' && styles.activeTabText]}>By Name</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, searchType === 'id' && styles.activeTab]} onPress={() => setSearchType('id')}>
                    <Text style={[styles.tabText, searchType === 'id' && styles.activeTabText]}>By UserID</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.userItem} onPress={() => navigation.navigate('Chat', { user: item })}>
                        <Image source={{ uri: item.avatar }} style={styles.avatar} />
                        <Text style={styles.userName}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    searchInput: {
        margin: 16,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    tab: {
        padding: 10,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#E9446A',
    },
    tabText: {
        fontSize: 16,
        color: '#555',
    },
    activeTabText: {
        color: '#E9446A',
        fontWeight: 'bold',
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    userName: {
        marginLeft: 10,
        fontSize: 16,
    },
});

export default SearchScreen;
