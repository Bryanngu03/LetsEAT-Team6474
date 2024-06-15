/*import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import MessageScreen from '../screens/MessageScreen';
import ReminderScreen from '../screens/ReminderScreen';
import PostScreen from '../screens/PostScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CommentsScreen from '../screens/CommentsScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

const HomeStackScreen = () => (
    <HomeStack.Navigator>
        <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <HomeStack.Screen name="Comments" component={CommentsScreen} />
    </HomeStack.Navigator>
);

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
                    } else if (route.name === 'Reminders') {
                        iconName = 'alarm-outline';
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
            <Tab.Screen name="HomeTab" component={HomeStackScreen} />
            <Tab.Screen name="Messages" component={MessageScreen} />
            <Tab.Screen name="Post" component={PostScreen} />
            <Tab.Screen name="Reminders" component={ReminderScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;*/

// BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import MessageScreen from '../screens/MessageScreen';
import ReminderScreen from '../screens/ReminderScreen';
import AddReminderScreen from '../screens/AddReminderScreen';
import PostScreen from '../screens/PostScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CommentsScreen from '../screens/CommentsScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ReminderStack = createStackNavigator();

const HomeStackScreen = () => (
    <HomeStack.Navigator>
        <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <HomeStack.Screen name="Comments" component={CommentsScreen} />
    </HomeStack.Navigator>
);

const ReminderStackScreen = () => (
    <ReminderStack.Navigator>
        <ReminderStack.Screen name="Reminders" component={ReminderScreen} />
        <ReminderStack.Screen name="AddReminder" component={AddReminderScreen} />
    </ReminderStack.Navigator>
);

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
                    } else if (route.name === 'Reminders') {
                        iconName = 'alarm-outline';
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
            <Tab.Screen name="HomeTab" component={HomeStackScreen} />
            <Tab.Screen name="Messages" component={MessageScreen} />
            <Tab.Screen name="Post" component={PostScreen} />
            <Tab.Screen name="Reminders" component={ReminderStackScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
