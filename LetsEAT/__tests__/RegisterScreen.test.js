import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '../screens/RegisterScreen';
import Fire from '../Fire';

jest.mock('../Fire', () => ({
  shared: {
    createUser: jest.fn(),
  },
}));

const navigation = { navigate: jest.fn(), goBack: jest.fn() };

describe('RegisterScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<RegisterScreen navigation={navigation} />);
    expect(getByText('Sign up')).toBeTruthy();
  });

  it('shows error message on registration failure', async () => {
    const { getByText, getByPlaceholderText } = render(<RegisterScreen navigation={navigation} />);

    const nameInput = getByPlaceholderText('Full Name');
    const emailInput = getByPlaceholderText('Email Address');
    const passwordInput = getByPlaceholderText('Password');
    const signUpButton = getByText('Sign up');

    fireEvent.changeText(nameInput, 'Test User');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(Fire.shared.createUser).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        avatar: null,
      });
    });

    expect(getByText('error message')).toBeTruthy(); // Replace with actual error message
  });

  it('navigates to login screen on successful registration', async () => {
    Fire.shared.createUser.mockResolvedValueOnce({});

    const { getByText, getByPlaceholderText } = render(<RegisterScreen navigation={navigation} />);

    const nameInput = getByPlaceholderText('Full Name');
    const emailInput = getByPlaceholderText('Email Address');
    const passwordInput = getByPlaceholderText('Password');
    const signUpButton = getByText('Sign up');

    fireEvent.changeText(nameInput, 'Test User');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(Fire.shared.createUser).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        avatar: null,
      });
    });

    expect(navigation.navigate).toHaveBeenCalledWith('Login');
  });
});