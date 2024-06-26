import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Fire from '../Fire';

const AddReminderScreen = ({ navigation, route }) => {
    const { postTitle, postDate } = route.params || {};
    const [title, setTitle] = useState(postTitle || '');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(postDate ? new Date(postDate) : new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [mode, setMode] = useState('date');

    useEffect(() => {
        if (postTitle) setTitle(postTitle);
        if (postDate) setDate(new Date(postDate));
    }, [postTitle, postDate]);

    const handleAddReminder = async () => {
        await Fire.shared.addReminder({ title, description, date: date.getTime() });
        navigation.goBack(); // Go back to the previous screen
    };

    const showMode = (currentMode) => {
        setShowPicker(true);
        setMode(currentMode);
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Title</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} />

            <Text style={styles.label}>Description</Text>
            <TextInput style={styles.input} value={description} onChangeText={setDescription} />

            <Text style={styles.label}>Date & Time</Text>
            <TouchableOpacity onPress={() => showMode('date')}>
                <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => showMode('time')}>
                <Text style={styles.dateText}>{date.toLocaleTimeString()}</Text>
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode={mode}
                    display="default"
                    onChange={onChange}
                    onCancel={() => setShowPicker(false)} // Handle cancel button
                />
            )}

            <TouchableOpacity style={styles.button} onPress={handleAddReminder}>
                <Text style={styles.buttonText}>Add Reminder</Text>
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
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 16,
        borderRadius: 4,
    },
    dateText: {
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#E9446A',
        padding: 16,
        borderRadius: 4,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default AddReminderScreen;
