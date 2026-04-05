import { render, screen } from '@testing-library/react';
import Home from './Home';

// test('renders Welcome message', () => {
//   render(<Home />);
//   const welcomeMessage = screen.getByText(/Welcome/i);
//   expect(welcomeMessage).toBeInTheDocument();
// });


it('renders Home component', () => {
  render(<Home />);
});