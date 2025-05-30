
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import MagicLinkSent from '../MagicLinkSent';

describe('MagicLinkSent', () => {
  const mockEmail = 'test@example.com';
  const mockOnTryDifferentMethod = vi.fn();

  it('displays the email address correctly', () => {
    render(<MagicLinkSent email={mockEmail} onTryDifferentMethod={mockOnTryDifferentMethod} />);
    
    expect(screen.getByText(mockEmail)).toBeInTheDocument();
    expect(screen.getByText('Check Your Email')).toBeInTheDocument();
  });

  it('calls onTryDifferentMethod when button is clicked', () => {
    render(<MagicLinkSent email={mockEmail} onTryDifferentMethod={mockOnTryDifferentMethod} />);
    
    const button = screen.getByText('Try a different method');
    fireEvent.click(button);
    
    expect(mockOnTryDifferentMethod).toHaveBeenCalledTimes(1);
  });
});
