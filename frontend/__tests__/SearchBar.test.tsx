import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar } from '../components/SearchBar';

describe('SearchBar', () => {
  it('renders search input', () => {
    render(<SearchBar onSearch={jest.fn()} />);

    const input = screen.getByPlaceholderText('Search for movies...');
    expect(input).toBeInTheDocument();
  });

  it('calls onSearch with debounced input', async () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search for movies...');
    fireEvent.change(input, { target: { value: 'batman' } });

    // Should not be called immediately
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Should be called after debounce delay (300ms)
    await waitFor(() => expect(mockOnSearch).toHaveBeenCalledWith('batman'), {
      timeout: 500,
    });
  });

  it('shows clear button when input has value', () => {
    render(<SearchBar onSearch={jest.fn()} />);

    const input = screen.getByPlaceholderText('Search for movies...');
    fireEvent.change(input, { target: { value: 'batman' } });

    const clearButton = screen.getByRole('button', { name: /clear search/i });
    expect(clearButton).toBeInTheDocument();
  });

  it('clears input when clear button is clicked', () => {
    render(<SearchBar onSearch={jest.fn()} />);

    const input = screen.getByPlaceholderText('Search for movies...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'batman' } });
    expect(input.value).toBe('batman');

    const clearButton = screen.getByRole('button', { name: /clear search/i });
    fireEvent.click(clearButton);

    expect(input.value).toBe('');
  });

  it('does not show clear button when input is empty', () => {
    render(<SearchBar onSearch={jest.fn()} />);

    const clearButton = screen.queryByRole('button', { name: /clear search/i });
    expect(clearButton).not.toBeInTheDocument();
  });

  it('uses initialQuery prop', () => {
    render(<SearchBar onSearch={jest.fn()} initialQuery="batman" />);

    const input = screen.getByPlaceholderText('Search for movies...') as HTMLInputElement;
    expect(input.value).toBe('batman');
  });

  it('trims whitespace from search query', async () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search for movies...');
    fireEvent.change(input, { target: { value: '  batman  ' } });

    await waitFor(() => expect(mockOnSearch).toHaveBeenCalledWith('batman'), {
      timeout: 500,
    });
  });

  it('does not call onSearch for empty or whitespace-only input', async () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={jest.fn()} />);

    const input = screen.getByPlaceholderText('Search for movies...');
    fireEvent.change(input, { target: { value: '   ' } });

    await waitFor(() => {}, { timeout: 500 });
    expect(mockOnSearch).not.toHaveBeenCalled();
  });
});
