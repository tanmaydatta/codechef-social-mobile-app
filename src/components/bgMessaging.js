// @flow
import firebase from 'react-native-firebase';
// Optional flow type

export default async (message) => {
    // handle your message
    const n = new firebase.notifications.Notification()
            .setNotificationId(Date.now()+'')
            .setTitle("test title")
            .setBody("test body");

            n.android.setChannelId('test-channel');

            firebase.notifications().displayNotification(n);
    console.log(message);
    return Promise.resolve();
}