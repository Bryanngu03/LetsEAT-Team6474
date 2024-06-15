// ReminderScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Fire from '../Fire';
import { Ionicons } from '@expo/vector-icons';

const ReminderScreen = ({ navigation }) => {
    const [reminders, setReminders] = useState([]);

    useEffect(() => {
        const fetchReminders = async () => {
            const reminders = await Fire.shared.getReminders();
            setReminders(reminders);
        };

        fetchReminders();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={reminders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.reminderItem}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                        <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
                    </View>
                )}
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
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
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
