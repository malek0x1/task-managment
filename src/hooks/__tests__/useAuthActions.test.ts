
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthActions } from '../useAuthActions';
import { useAuthStore } from '@/store/useAuthStore';
import { useProjectStore } from '@/store/useProjectStore';
import { toast } from '../use-toast';


vi.mock('@/store/useAuthStore', () => ({
  useAuthStore: vi.fn()
}));

vi.mock('@/store/useProjectStore', () => ({
  useProjectStore: vi.fn()
}));

vi.mock('../use-toast', () => ({
  toast: vi.fn()
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn().mockResolvedValue({ data: {}, error: null })
    }
  }
}));

describe('useAuthActions', () => {
  const mockLogin = vi.fn();
  const mockSignUp = vi.fn();
  const mockSendMagicLink = vi.fn();
  const mockFetchProjects = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    (useAuthStore as any).mockReturnValue({
      login: mockLogin,
      signUp: mockSignUp,
      sendMagicLink: mockSendMagicLink
    });
    
    (useProjectStore as any).mockReturnValue({
      fetchProjects: mockFetchProjects
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAuthActions());
    
    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isMagicLinkSent).toBe(false);
  });

  it('should handle email sign in correctly', async () => {
    mockLogin.mockResolvedValueOnce({});
    
    const { result } = renderHook(() => useAuthActions());
    

    act(() => {
      result.current.setEmail('test@example.com');
      result.current.setPassword('password123');
    });
    

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
    
    await act(async () => {
      await result.current.handleEmailSignIn(mockEvent);
    });
    
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(toast).toHaveBeenCalled();
  });

  it('should handle magic link sign in correctly', async () => {
    mockSendMagicLink.mockResolvedValueOnce({});
    
    const { result } = renderHook(() => useAuthActions());
    

    act(() => {
      result.current.setEmail('test@example.com');
    });
    

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
    
    await act(async () => {
      await result.current.handleMagicLinkSignIn(mockEvent);
    });
    
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockSendMagicLink).toHaveBeenCalledWith('test@example.com');
    expect(result.current.isMagicLinkSent).toBe(true);
    expect(toast).toHaveBeenCalled();
  });
});
