
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Mail } from 'lucide-react';

interface MagicLinkFormProps {
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
  handleMagicLinkSignIn: (e: React.FormEvent) => Promise<void>;
}

const MagicLinkForm: React.FC<MagicLinkFormProps> = ({
  email,
  setEmail,
  isLoading,
  handleMagicLinkSignIn
}) => {
  return (
    <form onSubmit={handleMagicLinkSignIn}>
      <CardHeader>
        <CardTitle>Magic Link Sign In</CardTitle>
        <CardDescription>
          We'll send you a link to sign in without a password.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="magic-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="magic-email"
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Send Magic Link
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center border-t p-4">
        <p className="text-xs text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardFooter>
    </form>
  );
};

export default MagicLinkForm;
