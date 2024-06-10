// UserPermissions.js
import * as MediaLibrary from 'expo-media-library';
import Constants from 'expo-constants';

class UserPermissions {
  getCameraPermission = async () => {
    if (Constants.platform.ios) {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== 'granted') {
        alert("We need permission to use your camera roll if you'd like to include a photo.");
      }
    }
  };
}

export default new UserPermissions();