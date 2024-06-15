// Fire.js
import { firebase } from './firebase';

class Fire {
    constructor() {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
    }

    // Add reminder under user's subcollection
    addReminder = async ({ title, description, date }) => {
        const user = firebase.auth().currentUser;
        if (!user) throw new Error("User not authenticated");

        return new Promise((res, rej) => {
            this.firestore
                .collection('users')
                .doc(user.uid)
                .collection('reminders')
                .add({
                    title,
                    description,
                    date: date.getTime(),
                    uid: user.uid,
                    timestamp: this.timestamp,
                })
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });
    };

    // Get reminders from user's subcollection
    getReminders = async () => {
        const user = firebase.auth().currentUser;
        if (!user) throw new Error("User not authenticated");

        const snapshot = await this.firestore
            .collection('users')
            .doc(user.uid)
            .collection('reminders')
            .orderBy('timestamp', 'desc')
            .get();

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    get firestore() {
        return firebase.firestore();
    }

    get uid() {
        return (firebase.auth().currentUser || {}).uid;
    }

    get timestamp() {
        return Date.now();
    }
}

Fire.shared = new Fire();
export default Fire;
