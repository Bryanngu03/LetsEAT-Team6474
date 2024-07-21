import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddReminderScreen from '../screens/AddReminderScreen';
import ReminderScreen from '../screens/ReminderScreen';
import Fire from '../Fire';

jest.mock('../Fire', () => ({
  shared: {
    addReminder: jest.fn()
  }
}));

const navigation = { navigate: jest.fn(), goBack: jest.fn() };
const route = { params: {} };

describe('AddReminderScreen', () => {
  it('allows the user to add a reminder and navigate back to ReminderScreen', async () => {
    const { getByText, getByPlaceholderText } = render(<AddReminderScreen navigation={navigation} route={route} />);

    fireEvent.changeText(getByPlaceholderText('Title'), 'Test Reminder');
    fireEvent.changeText(getByPlaceholderText('Description'), 'Test Description');
    fireEvent.press(getByText('Add Reminder'));

    await waitFor(() => {
      expect(Fire.shared.addReminder).toHaveBeenCalledWith({
        title: 'Test Reminder',
        description: 'Test Description',
        date: expect.any(Number)
      });
      expect(navigation.goBack).toHaveBeenCalled();
    });
  });
});