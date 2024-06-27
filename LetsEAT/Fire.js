import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

class Fire {
    constructor() {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
    }

    addPost = async ({ text, localUri, likes, commentsCount, date, locationLink, locationName }) => {
        if (!localUri) {
            throw new Error("No localUri provided");
        }
        try {
            const remoteUri = await this.uploadPhotoAsync(localUri, `photos/${this.uid}/${Date.now()}.jpg`);
            const userDoc = await this.firestore.collection('users').doc(this.uid).get();
            const userData = userDoc.data();

            return this.firestore.collection('posts').add({
                text,
                uid: this.uid,
                timestamp: Date.now(),
                date, // UNIX timestamp directly
                image: remoteUri,
                name: userData.name,
                avatar: userData.avatar,
                likes,
                commentsCount,
                locationLink,
                locationName
            });
        } catch (error) {
            throw error;
        }
    };

    getReminders = async () => {
        const uid = this.uid;
        const reminders = [];
        const querySnapshot = await this.firestore.collection('users').doc(uid).collection('reminders').get();
        querySnapshot.forEach(doc => {
            reminders.push({ id: doc.id, ...doc.data() });
        });
        return reminders;
    };

    addReminder = async ({ title, description, date }) => {
        const uid = this.uid;
        await this.firestore.collection('users').doc(uid).collection('reminders').add({
            title,
            description,
            date, // UNIX timestamp directly
            timestamp: Date.now(),
            uid
        });
    };

    uploadPhotoAsync = async (uri, filename) => {
        const path = `photos/${this.uid}/${Date.now()}.jpg`;

        return new Promise(async (res, rej) => {
            try {
                if (!uri.startsWith('file://')) {
                    throw new Error("Invalid URI");
                }
                const response = await fetch(uri);
                if (!response.ok) {
                    throw new Error(`Failed to fetch the image: ${response.statusText}`);
                }
                const file = await response.blob();

                let upload = firebase.storage().ref(path).put(file);

                upload.on(
                    'state_changed',
                    snapshot => {},
                    err => {
                        rej(err);
                    },
                    async () => {
                        const url = await upload.snapshot.ref.getDownloadURL();
                        res(url);
                    }
                );
            } catch (error) {
                rej(error);
            }
        });
    };

    get firestore() {
        return firebase.firestore();
    }

    get uid() {
        return (firebase.auth().currentUser || {}).uid;
    }

    get timestamp() {
        return firebase.firestore.Timestamp.now();
    }
}

Fire.shared = new Fire();
export default Fire;
