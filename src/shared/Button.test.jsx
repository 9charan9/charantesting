import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../shared/Button';

// Mock fetch for API testing
global.fetch = jest.fn();

describe('Button Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders button with children text', () => {
    // Arrange & Act
    render(<Button>Click me</Button>);

    // Assert
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockOnClick = jest.fn();
    render(<Button onClick={mockOnClick}>Click me</Button>);

    // Act
    await user.click(screen.getByRole('button', { name: /click me/i }));

    // Assert
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('applies custom styles and className', () => {
    // Arrange & Act
    const customStyle = { backgroundColor: 'red' };
    const customClass = 'custom-button';
    render(
      <Button style={customStyle} className={customClass}>
        Styled Button
      </Button>
    );

    // Assert
    const buttonElement = screen.getByRole('button', { name: /styled button/i });
    expect(buttonElement).toHaveStyle(customStyle);
    expect(buttonElement).toHaveClass(customClass);
  });

  test('handles async onClick with API mock', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockApiResponse = { success: true, message: 'API call successful' };

    // Mock the fetch API
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    });

    const mockOnClick = jest.fn().mockImplementation(async () => {
      const response = await fetch('/api/test');
      const data = await response.json();
      return data;
    });

    render(<Button onClick={mockOnClick}>API Call Button</Button>);

    // Act
    await user.click(screen.getByRole('button', { name: /api call button/i }));

    // Assert
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/api/test');
  });

  test('is disabled when disabled prop is true', () => {
    // Arrange & Act
    render(<Button disabled>Disabled Button</Button>);

    // Assert
    const buttonElement = screen.getByRole('button', { name: /disabled button/i });
    expect(buttonElement).toBeDisabled();
  });

  test('does not call onClick when disabled', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockOnClick = jest.fn();
    render(
      <Button disabled onClick={mockOnClick}>
        Disabled Button
      </Button>
    );

    // Act
    await user.click(screen.getByRole('button', { name: /disabled button/i }));

    // Assert
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  test('renders with correct button type', () => {
    // Arrange & Act
    render(<Button type="submit">Submit Button</Button>);

    // Assert
    const buttonElement = screen.getByRole('button', { name: /submit button/i });
    expect(buttonElement).toHaveAttribute('type', 'submit');
  });
});