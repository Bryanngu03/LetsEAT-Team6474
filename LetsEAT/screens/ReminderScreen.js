import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebase';
import firebase from 'firebase/compat/app';

const ReminderScreen = ({ navigation }) => {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReminders();
    }, []);

    const fetchReminders = async () => {
        try {
            const remindersRef = db.collection('reminders').orderBy('date', 'desc');
            remindersRef.onSnapshot(querySnapshot => {
                const reminders = [];
                querySnapshot.forEach(doc => {
                    reminders.push({ id: doc.id, ...doc.data(), date: doc.data().date.toDate() });
                });
                setReminders(reminders);
                setLoading(false);
            });
        } catch (error) {
            console.error('Error fetching reminders: ', error);
            setLoading(false);
        }
    };

    const deleteReminder = async (id) => {
        try {
            await db.collection('reminders').doc(id).delete();
            Alert.alert('Success', 'Reminder deleted successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to delete reminder');
        }
    };

    const renderReminder = ({ item }) => (
        <View style={styles.reminderItem}>
            <View style={styles.reminderText}>
                <Text style={styles.reminderTitle}>{item.title}</Text>
                <Text style={styles.reminderDescription}>{item.description}</Text>
                <Text style={styles.reminderDate}>{item.date.toLocaleString()}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteReminder(item.id)}>
                <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Reminders List</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AddReminder')}>
                    <Ionicons name="add-circle-outline" size={24} color="#D8D9DB" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={reminders}
                renderItem={renderReminder}
                keyExtractor={item => item.id}
                style={styles.remindersList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#D8D9DB',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '500',
    },
    remindersList: {
        flex: 1,
        padding: 16,
    },
    reminderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    reminderText: {
        flex: 1,
    },
    reminderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    reminderDescription: {
        fontSize: 14,
        color: '#555',
    },
    reminderDate: {
        fontSize: 12,
        color: '#999',
        marginTop: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ReminderScreen;
