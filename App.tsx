import React, { useCallback, useEffect, useState } from 'react';
import { ApolloProvider } from 'react-apollo-hooks';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';
import Constants from 'expo-constants';
import { Vibration, View, Text } from 'react-native';
import client from './apollo';
import Chat from './components/Chat';

export default function App() {
  const [notificationStatus, setNotificationStatus] = useState('');
  const [notification, setNotification] = useState();

  const askPermission = useCallback(async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      console.log(finalStatus);
      const token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  }, []);

  const handleNotification = (notification: any) => {
    Vibration.vibrate(1);
    console.log(notification);
  };

  useEffect(() => {
    askPermission();

    Notifications.addListener(handleNotification);
  }, [askPermission]);

  return (
    <ApolloProvider client={client}>
      <Chat />
    </ApolloProvider>
  );
}
