import { render, screen } from '@testing-library/react';
import Header from './Header';

// test('renders Todo List heading', () => {
//   render(<Header />);
//   const heading = screen.getByText(/Todo List/i);
//   expect(heading).toBeInTheDocument();
// });


it('renders Header component', () => {
  render(<Header />);
});