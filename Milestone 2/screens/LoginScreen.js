// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { firebase } from '../firebase';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      navigation.navigate('Main'); // Navigate to the bottom tab navigator
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/Logo.png")} 
        style={styles.logo}
      />
      <View style={styles.errorMessage}>
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      </View>
      <View style={styles.form}>
        <View style={{ marginTop: -20 }}>
          <Text style={styles.inputTitle}>Email Address</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onChangeText={setEmail}
            value={email}
          />
        </View>
        <View style={{ marginTop: 32 }}>
          <Text style={styles.inputTitle}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
            onChangeText={setPassword}
            value={password}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={{ color: "#FFF", fontWeight: "500" }}>Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ alignSelf: "center", marginTop: 32 }}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={{ color: "#414959", fontSize: 13 }}>
          New to LetsEAT? <Text style={{ fontWeight: "500", color: "#E9446A" }}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  logo: {
    alignSelf: 'center',
    width: 300, 
    height: 300, 
    resizeMode: 'contain', 
  },
  errorMessage: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30,
  },
  error: {
    color: "#E9446A",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  form: {
    marginBottom: 36,
    marginHorizontal: 30,
  },
  inputTitle: {
    color: "#8A8F9E",
    fontSize: 10,
    textTransform: "uppercase",
  },
  input: {
    borderBottomColor: "#8A8F9E",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    color: "#161F3D",
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: "#E9446A",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LoginScreen;
