
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MagicLinkSentProps {
  email: string;
  onTryDifferentMethod: () => void;
}

const MagicLinkSent: React.FC<MagicLinkSentProps> = ({ email, onTryDifferentMethod }) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
        <CardDescription>
          We've sent a magic link to <strong>{email}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p className="text-sm text-gray-500">
          Click the link in your email to sign in. If you don't see it, check your spam folder.
        </p>
        <Button
          variant="outline"
          className="w-full"
          onClick={onTryDifferentMethod}
        >
          Try a different method
        </Button>
      </CardContent>
    </Card>
  );
};

export default MagicLinkSent;
