import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import MessageScreen from '../screens/MessageScreen';
import NotificationScreen from '../screens/NotificationScreen';
import PostScreen from '../screens/PostScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'HomeTab') {
                        iconName = 'home-outline';
                    } else if (route.name === 'Messages') {
                        iconName = 'chatbubbles-outline';
                    } else if (route.name === 'Notifications') {
                        iconName = 'notifications-outline';
                    } else if (route.name === 'Post') {
                        iconName = 'add-circle-outline';
                    } else if (route.name === 'Profile') {
                        iconName = 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#161F3D',
                tabBarInactiveTintColor: '#BBBBBB',
                tabBarStyle: { display: 'flex' }
            })}
        >
            <Tab.Screen name="HomeTab" component={HomeScreen} />
            <Tab.Screen name="Messages" component={MessageScreen} />
            <Tab.Screen name="Post" component={PostScreen} />
            <Tab.Screen name="Notifications" component={NotificationScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
