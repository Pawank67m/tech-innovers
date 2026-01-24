'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { Loader2, Shield, Zap, Eye, EyeOff } from 'lucide-react';
import { AuthError } from 'firebase/auth';
import { PrismFluxLoader } from '@/components/ui/prism-loader';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showEmailLink, setShowEmailLink] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [emailLinkEmail, setEmailLinkEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [emailLinkMessage, setEmailLinkMessage] = useState('');
  const [isTransformersTheme, setIsTransformersTheme] = useState(false);
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, sendSignInLink, completeSignInWithEmailLink, resetPassword, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkTheme = () => {
      const hasTransformersTheme = document.documentElement.classList.contains('transformers-theme');
      setIsTransformersTheme(hasTransformersTheme);
    };
    
    checkTheme();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const getErrorMessage = (error: AuthError) => {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials.';
      default:
        return error.message || 'An error occurred. Please try again.';
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      // Redirect will happen automatically via useEffect
    } catch (error: any) {
      console.error('Email sign in error:', error);
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);
      await signInWithGoogle();
      // Redirect will happen automatically via useEffect
    } catch (error: any) {
      console.error('Google sign in error:', error);
      setError(getErrorMessage(error));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(resetEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await resetPassword(resetEmail);
      setResetMessage('Password reset email sent! Check your inbox.');
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error: any) {
      console.error('Password reset error:', error);
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(emailLinkEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('Sending email link to:', emailLinkEmail);
      await sendSignInLink(emailLinkEmail);
      setEmailLinkMessage('Sign-in link sent! Check your email and click the link to sign in.');
      setShowEmailLink(false);
      setEmailLinkEmail('');
      console.log('Email link sent successfully');
    } catch (error: any) {
      console.error('Email link error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isTransformersTheme ? 'transformers-bg-battle' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
        <div className="text-center">
          <PrismFluxLoader size={60} className="mx-auto mb-4" />
          <p className="text-muted-foreground">Welcome back! Redirecting...</p>
        </div>
      </div>
    );
  }

  if (showEmailLink) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${isTransformersTheme ? 'transformers-bg-battle' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
        <Card className={`w-full max-w-md ${isTransformersTheme ? 'transformers-card' : ''}`}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {isTransformersTheme ? (
                <Shield className="h-12 w-12 text-cyan-400" />
              ) : (
                <Zap className="h-12 w-12 text-blue-600" />
              )}
            </div>
            <CardTitle className={`text-2xl font-bold ${isTransformersTheme ? 'matrix-text' : ''}`}>
              Passwordless Sign In
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your email to receive a secure sign-in link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleEmailLinkSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-link">Email</Label>
                <Input
                  id="email-link"
                  type="email"
                  value={emailLinkEmail}
                  onChange={(e) => setEmailLinkEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={isTransformersTheme ? 'transformers-input' : ''}
                  required
                />
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full ${isTransformersTheme ? 'autobot-button' : ''}`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  'Send Sign-In Link'
                )}
              </Button>
            </form>
            
            <Button
              variant="ghost"
              onClick={() => setShowEmailLink(false)}
              className="w-full"
            >
              Back to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showForgotPassword) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${isTransformersTheme ? 'transformers-bg-battle' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
        <Card className={`w-full max-w-md ${isTransformersTheme ? 'transformers-card' : ''}`}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {isTransformersTheme ? (
                <Shield className="h-12 w-12 text-cyan-400" />
              ) : (
                <Zap className="h-12 w-12 text-blue-600" />
              )}
            </div>
            <CardTitle className={`text-2xl font-bold ${isTransformersTheme ? 'matrix-text' : ''}`}>
              Reset Password
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={isTransformersTheme ? 'transformers-input' : ''}
                  required
                />
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full ${isTransformersTheme ? 'autobot-button' : ''}`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Email'
                )}
              </Button>
            </form>
            
            <Button
              variant="ghost"
              onClick={() => setShowForgotPassword(false)}
              className="w-full"
            >
              Back to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isTransformersTheme ? 'transformers-bg-battle' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      <Card className={`w-full max-w-md ${isTransformersTheme ? 'transformers-card' : ''}`}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {isTransformersTheme ? (
              <Shield className="h-12 w-12 text-cyan-400" />
            ) : (
              <Zap className="h-12 w-12 text-blue-600" />
            )}
          </div>
          <CardTitle className={`text-2xl font-bold ${isTransformersTheme ? 'matrix-text' : ''}`}>
            Welcome to Tech Innovers
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to access all features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          
          {emailLinkMessage && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              {emailLinkMessage}
            </div>
          )}
          
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={isTransformersTheme ? 'transformers-input' : ''}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`pr-10 ${isTransformersTheme ? 'transformers-input' : ''}`}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full ${isTransformersTheme ? 'autobot-button' : ''}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <Button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            variant="outline"
            className={`w-full ${isTransformersTheme ? 'decepticon-button' : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'}`}
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>
          
          <div className="text-center space-y-2">
            <Button
              variant="link"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Forgot your password?
            </Button>
            
            <Button
              variant="link"
              onClick={() => setShowEmailLink(true)}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Sign in with email link (passwordless)
            </Button>
            
            <div className="text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Button
                variant="link"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setResetMessage('');
                  setEmailLinkMessage('');
                }}
                className="p-0 h-auto font-semibold text-primary hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Create Account'}
              </Button>
            </div>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
}