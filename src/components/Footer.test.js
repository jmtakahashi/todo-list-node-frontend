import { render, screen } from '@testing-library/react';
import Footer from './Footer';

// test('renders Jaytee link', () => {
//   render(<Footer />);
//   const linkElement = screen.getByText(/Jaytee/i);
//   expect(linkElement).toBeInTheDocument();
// });

it('renders Footer component', () => {
  render(<Footer />);
});
