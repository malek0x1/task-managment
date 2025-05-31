import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Key, Github } from "lucide-react";

interface EmailSignUpFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  handleEmailSignUp: (e: React.FormEvent) => Promise<void>;
  handleSocialSignIn: (provider: "github") => Promise<void>;
}

const EmailSignUpForm: React.FC<EmailSignUpFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  handleEmailSignUp,
  handleSocialSignIn,
}) => {
  return (
    <form onSubmit={handleEmailSignUp}>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Sign up for a new account to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <div className="relative">
            <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="signup-password"
              type="password"
              placeholder="Create a password"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <p className="text-xs text-gray-500">
            Password must be at least 8 characters long.
          </p>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Create Account
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

export default EmailSignUpForm;
