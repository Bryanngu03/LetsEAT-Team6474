import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen';
import { firebase } from '../firebase';

jest.mock('../firebase', () => ({
  firebase: {
    auth: jest.fn().mockReturnThis(),
    signInWithEmailAndPassword: jest.fn(),
  },
}));

const navigation = { navigate: jest.fn() };

describe('LoginScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<LoginScreen navigation={navigation} />);
    expect(getByText('Sign in')).toBeTruthy();
  });

  it('shows error message on login failure', async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen navigation={navigation} />);

    const emailInput = getByPlaceholderText('Email Address');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Sign in');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(firebase.auth().signInWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password');
    });

    expect(getByText('error message')).toBeTruthy(); // Replace with actual error message
  });

  it('navigates to main screen on successful login', async () => {
    firebase.auth().signInWithEmailAndPassword.mockResolvedValueOnce({});

    const { getByText, getByPlaceholderText } = render(<LoginScreen navigation={navigation} />);

    const emailInput = getByPlaceholderText('Email Address');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Sign in');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(firebase.auth().signInWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password');
    });

    expect(navigation.navigate).toHaveBeenCalledWith('Main');
  });
});