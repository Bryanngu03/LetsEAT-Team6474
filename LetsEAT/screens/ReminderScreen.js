// ReminderScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import Fire from '../Fire';
import { Ionicons } from '@expo/vector-icons';

const ReminderScreen = ({ navigation }) => {
    const [reminders, setReminders] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchReminders = useCallback(async () => {
        setRefreshing(true);
        const reminders = await Fire.shared.getReminders();
        setReminders(reminders);
        setRefreshing(false);
    }, []);

    useEffect(() => {
        fetchReminders();
    }, [fetchReminders]);

    const deleteReminder = async (id) => {
        await Fire.shared.deleteReminder(id);
        fetchReminders(); // Refresh reminders list after deletion
    };

    const renderItem = ({ item }) => (
        <View style={styles.reminderItem}>
            <View style={styles.reminderInfo}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteReminder(item.id)}>
                <Ionicons name="ellipse-outline" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
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
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddReminder')}>
                <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
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
    deleteButton: {
        padding: 8,
    },
    addButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ReminderScreen;
