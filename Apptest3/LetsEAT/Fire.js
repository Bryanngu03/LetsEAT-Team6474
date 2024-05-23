import { firebase } from './firebase';

class Fire {
    addPost = async ({ text, localUri }) => {
        console.log("Starting addPost...");
        if (!localUri) {
            console.error("No localUri provided");
            throw new Error("No localUri provided");
        }
        try {
            const remoteUri = await this.uploadPhotoAsync(localUri);
            console.log("Photo uploaded to: ", remoteUri);

            return new Promise((res, rej) => {
                this.firestore
                    .collection('posts')
                    .add({
                        text,
                        uid: this.uid,
                        timestamp: this.timestamp,
                        image: remoteUri
                    })
                    .then(ref => {
                        console.log("Post added: ", ref.id);
                        res(ref);
                    })
                    .catch(error => {
                        console.error("Error adding post to Firestore: ", error);
                        rej(error);
                    });
            });
        } catch (error) {
            console.error("Error in addPost: ", error);
            throw error;
        }
    };

    uploadPhotoAsync = async uri => {
        const path = `photos/${this.uid}/${Date.now()}.jpg`;
        console.log("Uploading photo to: ", path);

        return new Promise(async (res, rej) => {
            try {
                if (!uri.startsWith('file://')) {
                    console.error("Invalid URI: ", uri);
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
                        console.error("Upload error: ", err);
                        rej(err);
                    },
                    async () => {
                        const url = await upload.snapshot.ref.getDownloadURL();
                        console.log("Photo uploaded to: ", url);
                        res(url);
                    }
                );
            } catch (error) {
                console.error("Network request failed: ", error);
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
        return Date.now();
    }
}

Fire.shared = new Fire();
export default Fire;
