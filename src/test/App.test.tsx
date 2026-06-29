import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

beforeEach(() => {
  localStorage.clear();
});

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toBeTruthy();
  });

  it('shows the landing view footer by default', () => {
    render(<App />);
    expect(screen.getByText(/AstroCAPTCHA Proof of Concept/i)).toBeTruthy();
  });
});
