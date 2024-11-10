import React from 'react';
import { render } from '@testing-library/react-native';
import Header from './Header';

describe('Header Component', () => {
  it('renders correctly with greeting and balance label', () => {
    const { getByText } = render(<Header />);
    
    // Verifica que el texto "Hello Andre," esté presente
    expect(getByText('Hello Andre,')).toBeTruthy();
    
    // Verifica que el texto "Your available balance" esté presente
    expect(getByText('Your available balance')).toBeTruthy();
  });
});
