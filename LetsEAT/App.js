// App.js
/* import React from 'react';
import AuthNavigator from './navigation/AuthNavigator';

export default function App() {
  return <AuthNavigator />;
} */

  import React, { useEffect, useRef } from 'react';
  import AuthNavigator from './navigation/AuthNavigator';
  import * as Notifications from 'expo-notifications';
  import * as Permissions from 'expo-permissions';
  
  export default function App() {
    const notificationListener = useRef();
    const responseListener = useRef();
  
    useEffect(() => {
      // Request permissions for iOS
      Permissions.getAsync(Permissions.NOTIFICATIONS).then(statusObj => {
        if (statusObj.status !== 'granted') {
          return Permissions.askAsync(Permissions.NOTIFICATIONS);
        }
        return statusObj;
      }).then(statusObj => {
        if (statusObj.status !== 'granted') {
          return;
        }
      });
  
      // This listener is fired whenever a notification is received while the app is foregrounded
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log(notification);
      });
  
      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });
  
      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, []);
  
    return <AuthNavigator />;
  }
