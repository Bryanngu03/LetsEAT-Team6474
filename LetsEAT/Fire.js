import { firebase } from './firebase';

class Fire {
    constructor() {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
    }

    // Method to create or get chat ID based on participants
    getOrCreateChatId = async (userId1, userId2) => {
        const chatId = `${userId1}_${userId2}`;
        const reverseChatId = `${userId2}_${userId1}`;
        let chatDoc = await this.firestore.collection('chats').doc(chatId).get();

        if (!chatDoc.exists) {
            chatDoc = await this.firestore.collection('chats').doc(reverseChatId).get();
            if (!chatDoc.exists) {
                await this.firestore.collection('chats').doc(chatId).set({
                    participants: [userId1, userId2],
                    latestMessage: '',
                    latestMessageTimestamp: Date.now(),
                });
                return chatId;
            } else {
                return reverseChatId;
            }
        } else {
            return chatId;
        }
    };

    sendMessage = async (chatId, message) => {
        const chatDocRef = this.firestore.collection('chats').doc(chatId);
        const messagesCollection = chatDocRef.collection('messages');

        await messagesCollection.add({
            text: message.text,
            sender: message.sender,
            receiver: message.receiver,
            timestamp: this.timestamp,
        });

        await chatDocRef.update({
            latestMessage: message.text,
            latestMessageTimestamp: this.timestamp,
        });
    };

    addPost = async ({ text, localUri, likes, commentsCount }) => {
        if (!localUri) {
            throw new Error("No localUri provided");
        }
        try {
            const remoteUri = await this.uploadPhotoAsync(localUri, `photos/${this.uid}/${Date.now()}.jpg`);
            const userDoc = await this.firestore.collection('users').doc(this.uid).get();
            const userData = userDoc.data();

            return new Promise((res, rej) => {
                this.firestore
                    .collection('posts')
                    .add({
                        text,
                        uid: this.uid,
                        timestamp: this.timestamp,
                        image: remoteUri,
                        name: userData.name,
                        avatar: userData.avatar,
                        likes,
                        commentsCount
                    })
                    .then(ref => {
                        res(ref);
                    })
                    .catch(error => {
                        rej(error);
                    });
            });
        } catch (error) {
            throw error;
        }
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

                let upload = firebase
                    .storage()
                    .ref(path)
                    .put(file);

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

    createUser = async user => {
        let remoteUri = null;

        try {
            await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);

            let db = this.firestore.collection("users").doc(this.uid);

            db.set({
                name: user.name,
                email: user.email,
                avatar: null
            });

            if (user.avatar) {
                remoteUri = await this.uploadPhotoAsync(user.avatar, `avatars/${this.uid}`);

                db.set({ avatar: remoteUri }, { merge: true });
            }
        } catch (error) {
            alert("Error: ", error);
        }
    };

    signOut = () => {
        firebase.auth().signOut();
    };

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

    // Delete reminder
    deleteReminder = async (id) => {
        const user = firebase.auth().currentUser;
        if (!user) throw new Error("User not authenticated");

        return new Promise((res, rej) => {
            this.firestore
                .collection('users')
                .doc(user.uid)
                .collection('reminders')
                .doc(id)
                .delete()
                .then(() => {
                    res();
                })
                .catch(error => {
                    rej(error);
                });
        });
    };

    savePost = async (postId) => {
        const user = firebase.auth().currentUser;
        if (!user) throw new Error("User not authenticated");

        const postRef = this.firestore.collection('posts').doc(postId);
        const postDoc = await postRef.get();

        if (!postDoc.exists) throw new Error("Post not found");

        const savedPostsRef = this.firestore.collection('users').doc(user.uid).collection('savedPosts').doc(postId);
        await savedPostsRef.set(postDoc.data());
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
