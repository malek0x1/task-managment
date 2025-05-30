
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import SaveIndicator from '../SaveIndicator';

describe('SaveIndicator', () => {
  it('shows saving message when isSaving is true', () => {
    render(<SaveIndicator isSaving={true} hasChanges={false} />);
    expect(screen.getByText('Saving changes...')).toBeInTheDocument();
  });

  it('shows autosaving message when hasChanges is true and not saving', () => {
    render(<SaveIndicator isSaving={false} hasChanges={true} />);
    expect(screen.getByText('Autosaving...')).toBeInTheDocument();
  });

  it('renders nothing when not saving and no changes', () => {
    const { container } = render(<SaveIndicator isSaving={false} hasChanges={false} />);
    expect(container.firstChild).toBeNull();
  });
});
