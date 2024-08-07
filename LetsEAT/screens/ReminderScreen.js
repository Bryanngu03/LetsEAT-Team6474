import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Fire from '../Fire';
import { Ionicons } from '@expo/vector-icons';

const ReminderScreen = ({ navigation, route }) => {
    const [reminders, setReminders] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const { postTitle, postDate } = route.params || {};

    const fetchReminders = useCallback(async () => {
        setRefreshing(true);
        try {
            const reminders = await Fire.shared.getReminders();
            reminders.sort((a, b) => a.date - b.date);
            setReminders(reminders);
        } catch (error) {
            console.error("Error fetching reminders:", error);
        }
        setRefreshing(false);
    }, []);

    useEffect(() => {
        fetchReminders();
    }, [fetchReminders]);

    useFocusEffect(
        useCallback(() => {
            fetchReminders();
        }, [fetchReminders])
    );

    const confirmDelete = (id) => {
        Alert.alert(
            "Delete Reminder",
            "Are you sure you want to delete this reminder?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Delete", onPress: () => deleteReminder(id) }
            ],
            { cancelable: false }
        );
    };

    const deleteReminder = async (id) => {
        try {
            await Fire.shared.deleteReminder(id);
            fetchReminders(); // Refresh reminders list after deletion
        } catch (error) {
            console.error("Error deleting reminder:", error);
        }
    };

    const editReminder = async (item) => {
        await deleteReminder(item.id);
        navigation.navigate('AddReminder', { postTitle: item.title, postDate: item.date, postDescription: item.description });
    };

    const renderItem = ({ item }) => (
        <View style={styles.reminderItem}>
            <View style={styles.reminderInfo}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
            </View>
            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.editButton} onPress={() => editReminder(item)}>
                    <Ionicons name="pencil-outline" size={24} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item.id)}>
                    <Ionicons name="close-circle-outline" size={24} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.tabHeader}>
                <Text style={styles.tabHeaderTitle}>Reminders</Text>
            </View>
            <FlatList
                data={reminders}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={fetchReminders}
                    />
                }
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddReminder', { postTitle, postDate })}
            >
                <Ionicons name="add" size={24} color="#fff" />
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
    reminderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    reminderInfo: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        marginVertical: 8,
    },
    date: {
        fontSize: 12,
        color: '#555',
    },
    actionButtons: {
        flexDirection: 'row',
    },
    editButton: {
        padding: 8,
    },
    deleteButton: {
        padding: 8,
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

export default ReminderScreen;
