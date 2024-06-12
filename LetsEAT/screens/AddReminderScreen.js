import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { db } from '../firebase';
import firebase from 'firebase/compat/app';

const AddReminderScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    const scheduleNotification = async (title, body, date) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: title,
                body: body,
                sound: true,
            },
            trigger: { date: date },
        });
    };

    const addReminder = async () => {
        if (title.trim() === '' || description.trim() === '') {
            Alert.alert('Error', 'Title and description cannot be empty');
            return;
        }

        try {
            await db.collection('reminders').add({
                title: title,
                description: description,
                date: firebase.firestore.Timestamp.fromDate(date),
                timestamp: new Date(),
            });

            scheduleNotification(title, description, date);

            Alert.alert('Success', 'Reminder added successfully');
            setTitle('');
            setDescription('');
            setDate(new Date());
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.dateText}>{date.toLocaleString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="datetime"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
                <TouchableOpacity style={styles.button} onPress={addReminder}>
                    <Text style={styles.buttonText}>Add</Text>
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
    form: {
        padding: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D8D9DB',
        borderRadius: 8,
        padding: 8,
        marginVertical: 8,
    },
    dateText: {
        padding: 8,
        borderColor: '#D8D9DB',
        borderWidth: 1,
        borderRadius: 8,
        marginVertical: 8,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#1E90FF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 8,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: '500',
    },
});

export default AddReminderScreen;