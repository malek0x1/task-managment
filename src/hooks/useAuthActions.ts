
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { useProjectStore } from '@/store/useProjectStore';

export function useAuthActions() {
  const navigate = useNavigate();
  const { login, signUp, sendMagicLink } = useAuthStore();
  const { fetchProjects } = useProjectStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Missing fields',
        description: 'Please enter both email and password.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      
      toast({
        title: 'Sign in successful',
        description: 'Welcome back!',
      });
      
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: 'Sign in failed',
        description: error.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Missing fields',
        description: 'Please enter both email and password.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(email, password);
      
      toast({
        title: 'Account created',
        description: 'Please check your email for confirmation.',
      });
      

      setTimeout(async () => {
        try {
          await fetchProjects();
        } catch (error) {
          console.error('Error fetching projects after signup:', error);
        }
      }, 500);
      
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: 'Sign up failed',
        description: error.message || 'Please try again with a different email.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await sendMagicLink(email);
      
      setIsMagicLinkSent(true);
      
      toast({
        title: 'Magic link sent',
        description: 'Please check your email for the sign-in link.',
      });
      
    } catch (error: any) {
      console.error('Magic link error:', error);
      toast({
        title: 'Failed to send magic link',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'github') => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      
      if (error) throw error;
      

      
    } catch (error: any) {
      console.error('Social sign-in error:', error);
      toast({
        title: 'Sign in failed',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    email,
    setEmail,
    password,
    setPassword,
    isMagicLinkSent,
    setIsMagicLinkSent,
    handleEmailSignIn,
    handleEmailSignUp,
    handleMagicLinkSignIn,
    handleSocialSignIn
  };
}
