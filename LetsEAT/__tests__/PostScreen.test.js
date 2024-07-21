import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PostScreen from '../screens/PostScreen';
import HomeScreen from '../screens/HomeScreen';
import Fire from '../Fire';

jest.mock('../Fire', () => ({
  shared: {
    addPost: jest.fn(),
    uid: 'user123'
  }
}));

const navigation = { navigate: jest.fn(), goBack: jest.fn() };

describe('PostScreen', () => {
  it('allows the user to add a post and navigate back to HomeScreen', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<PostScreen navigation={navigation} />);

    fireEvent.changeText(getByPlaceholderText('Want to share something?'), 'Test Post');
    fireEvent.press(getByTestId('cameraButton'));

    const uri = 'test-uri';
    Fire.shared.addPost.mockResolvedValueOnce({ uri });

    fireEvent.press(getByText('Post'));

    await waitFor(() => {
      expect(Fire.shared.addPost).toHaveBeenCalledWith({
        text: 'Test Post',
        localUri: uri,
        likes: 0,
        commentsCount: 0,
        date: expect.any(Number),
        locationLink: '',
        locationName: ''
      });
      expect(navigation.goBack).toHaveBeenCalled();
    });
  });
});