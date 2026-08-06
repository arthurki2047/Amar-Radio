
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/firebase';
import { 
  initiateGoogleSignIn, 
  initiateEmailSignIn, 
  initiateEmailSignUp,
  initiatePasswordReset,
  initiatePhoneSignIn
} from '@/firebase/non-blocking-login';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Chrome, Mail, Lock, AlertCircle, CheckCircle2, ArrowLeft, User, Loader2, Eye, EyeOff, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/context/app-context';
import { motion, AnimatePresence } from 'framer-motion';
import { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALLOWED_DOMAINS = [
  'gmail.com',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'zoho.com'
];

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const auth = useAuth();
  const { toast } = useToast();
  const { t } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPendingVerification, setIsPendingVerification] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);

  // Cleanup reCAPTCHA on unmount
  useEffect(() => {
    return () => {
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
        recaptchaVerifier.current = null;
      }
    };
  }, []);

  const validateEmailDomain = (emailToValidate: string) => {
    const domain = emailToValidate.split('@')[1]?.toLowerCase();
    return ALLOWED_DOMAINS.includes(domain);
  };

  const handleEmailAuth = async (mode: 'login' | 'signup') => {
    if (!email || !password || (mode === 'signup' && !name)) {
      toast({
        title: t('auth_missing_info_title'),
        description: t('auth_missing_info_desc'),
        variant: "destructive",
      });
      return;
    }

    if (mode === 'signup' && !validateEmailDomain(email)) {
      toast({
        title: t('auth_unsupported_domain_title'),
        description: t('auth_unsupported_domain_desc'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'login') {
        await initiateEmailSignIn(auth, email, password);
        toast({ title: t('auth_welcome_back'), description: t('auth_signed_in_desc') });
        onClose();
      } else {
        await initiateEmailSignUp(auth, email, password, name);
        setIsPendingVerification(true);
      }
    } catch (error: any) {
      let message = t('auth_generic_error');
      
      if (error.code === 'auth/user-not-found') message = t('auth_user_not_found');
      if (error.code === 'auth/wrong-password') message = t('auth_wrong_password');
      if (error.code === 'auth/invalid-credential') message = t('auth_invalid_credential');
      if (error.code === 'auth/email-already-in-use') message = t('auth_email_in_use');
      if (error.code === 'auth/weak-password') message = t('auth_weak_password');
      if (error.code === 'auth/email-not-verified') message = t('auth_email_not_verified_msg');
      
      toast({
        title: t('auth_failed_title'),
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSignIn = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: t('auth_missing_phone_title'),
        description: t('auth_missing_phone_desc'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (!recaptchaVerifier.current) {
        const container = document.getElementById('recaptcha-container');
        if (!container) {
          throw new Error("Security verification container not found. Please refresh and try again.");
        }
        
        recaptchaVerifier.current = new RecaptchaVerifier(auth, container, {
          'size': 'invisible',
          'callback': () => {},
          'expired-callback': () => {
            if (recaptchaVerifier.current) {
              recaptchaVerifier.current.clear();
              recaptchaVerifier.current = null;
            }
          }
        });
      }

      const result = await initiatePhoneSignIn(auth, phoneNumber, recaptchaVerifier.current);
      setConfirmationResult(result);
      toast({
        title: t('auth_otp_sent_title'),
        description: t('auth_otp_sent_desc'),
      });
    } catch (error: any) {
      let errorMessage = t('auth_generic_error');
      if (error.code === 'auth/invalid-phone-number') errorMessage = "Invalid phone number format.";
      if (error.code === 'auth/too-many-requests') errorMessage = "Too many attempts. Please try again later.";

      toast({
        title: t('auth_failed_title'),
        description: errorMessage,
        variant: "destructive",
      });
      
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
        recaptchaVerifier.current = null;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !confirmationResult) return;

    setIsLoading(true);
    try {
      await confirmationResult.confirm(otp);
      toast({ 
        title: t('auth_welcome_back'), 
        description: t('auth_signed_in_desc') 
      });
      onClose();
    } catch (error: any) {
      toast({
        title: t('auth_failed_title'),
        description: t('auth_invalid_otp'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast({
        title: t('auth_missing_email_title'),
        description: t('auth_missing_email_desc'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await initiatePasswordReset(auth, email);
      toast({
        title: t('auth_reset_sent_title'),
        description: t('auth_reset_sent_desc', { email }),
      });
      setIsForgotPassword(false);
    } catch (error: any) {
      toast({
        title: t('auth_reset_failed_title'),
        description: t('auth_generic_error'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await initiateGoogleSignIn(auth);
      toast({ 
        title: t('auth_welcome_back'), 
        description: t('auth_signed_in_desc') 
      });
      onClose();
    } catch (error: any) {
      let errorMessage = t('auth_generic_error');
      
      if (error.code === 'auth/unauthorized-domain') {
        errorMessage = `This domain (${window.location.hostname}) is not authorized in the Firebase Console. Please add it to the "Authorized Domains" list in Authentication > Settings.`;
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "The sign-in popup was blocked by your browser. Please allow popups for this site.";
      } else if (error.code === 'auth/cancelled-by-user') {
        errorMessage = "Sign-in was cancelled.";
      }

      toast({
        title: t('auth_failed_title'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setIsForgotPassword(false);
    setIsPendingVerification(false);
    setConfirmationResult(null);
    setPassword('');
    setPhoneNumber('+91');
    setOtp('');
    setShowPassword(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetState();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[420px] z-[60] bg-[#0f172a] border-white/10 text-white shadow-2xl overflow-hidden rounded-[2rem]">
        <div id="recaptcha-container"></div>
        
        <AnimatePresence mode="wait">
          {isPendingVerification ? (
            <motion.div 
              key="verification"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-8"
            >
              <DialogHeader>
                <div className="flex justify-center mb-6">
                  <div className="bg-green-500/20 p-4 rounded-full">
                    <CheckCircle2 className="h-14 w-14 text-green-500" />
                  </div>
                </div>
                <DialogTitle className="text-3xl font-bold text-center tracking-tight">{t('auth_verification_sent_title')}</DialogTitle>
                <DialogDescription className="py-4 text-center text-lg text-gray-300">
                  {t('auth_verification_sent_desc', { email })}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <Button onClick={onClose} className="w-full h-14 mt-6 text-lg font-bold bg-green-600 hover:bg-green-700 rounded-2xl shadow-lg transition-all active:scale-95">
                  {t('auth_verification_got_it')}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsPendingVerification(false)} 
                  className="w-full text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('auth_back_to_login')}
                </Button>
              </div>
            </motion.div>
          ) : isForgotPassword ? (
            <motion.div 
              key="forgot-password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 py-4"
            >
              <DialogHeader>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-fit p-0 hover:bg-transparent -ml-1 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setIsForgotPassword(false)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('auth_back_to_login')}
                </Button>
                <DialogTitle className="text-3xl font-bold tracking-tight mt-2">{t('auth_forgot_password_title')}</DialogTitle>
                <DialogDescription className="text-gray-400">
                  {t('auth_forgot_password_desc')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-reset" className="text-sm font-medium text-gray-300">{t('auth_email_label')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Input 
                      id="email-reset" 
                      placeholder="email@example.com" 
                      className="pl-12 h-14 bg-white/5 border-white/10 text-white rounded-xl focus:ring-purple-500 focus:border-purple-500" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <Button 
                  className="w-full h-14 bg-purple-600 text-white hover:bg-purple-700 font-bold text-lg rounded-2xl shadow-xl transition-all active:scale-95" 
                  onClick={handlePasswordReset}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                  {isLoading ? t('auth_processing') : t('auth_send_reset_link')}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="auth-main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold text-center tracking-tight mb-2">{t('auth_welcome_title')}</DialogTitle>
                <DialogDescription className="text-center text-gray-400 text-base">
                  {t('auth_welcome_desc')}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-4">
                <Button 
                  variant="outline" 
                  className="w-full gap-3 h-14 border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-lg rounded-2xl transition-all active:scale-95" 
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <Chrome className="h-6 w-6 text-red-500" />
                  {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                  {isLoading ? t('auth_processing') : t('auth_continue_google')}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#0f172a] px-4 text-gray-500 font-bold tracking-widest">{t('auth_divider')}</span>
                  </div>
                </div>

                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/5 p-1 rounded-2xl border border-white/10 h-14">
                    <TabsTrigger value="login" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white font-bold">{t('auth_login_tab')}</TabsTrigger>
                    <TabsTrigger value="signup" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white font-bold">{t('auth_signup_tab')}</TabsTrigger>
                    <TabsTrigger value="phone" className="rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white font-bold">{t('auth_phone_tab')}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="space-y-4 outline-none">
                    <div className="space-y-2">
                      <Label htmlFor="email-login" className="text-sm font-medium text-gray-300">{t('auth_email_label')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <Input 
                          id="email-login" 
                          placeholder="email@example.com" 
                          className="pl-12 h-14 bg-white/5 border-white/10 text-white rounded-xl focus:ring-purple-500 focus:border-purple-500" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password-login" className="text-sm font-medium text-gray-300">{t('auth_password_label')}</Label>
                        <Button 
                          variant="link" 
                          className="px-0 h-auto text-xs text-purple-400 hover:text-purple-300 transition-colors"
                          onClick={() => setIsForgotPassword(true)}
                        >
                          {t('auth_forgot_password_link')}
                        </Button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <Input 
                          id="password-login" 
                          type={showPassword ? "text" : "password"} 
                          className="pl-12 pr-12 h-14 bg-white/5 border-white/10 text-white rounded-xl focus:ring-purple-500 focus:border-purple-500" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    <Button 
                      className="w-full h-14 bg-purple-600 text-white hover:bg-purple-700 font-bold text-lg rounded-2xl shadow-xl transition-all active:scale-95 mt-2" 
                      onClick={() => handleEmailAuth('login')}
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                      {isLoading ? t('auth_processing') : t('auth_login_tab')}
                    </Button>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4 outline-none">
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex gap-3 text-xs text-amber-200 mb-2">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <p>{t('auth_signup_warning')}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name-signup" className="text-sm font-medium text-gray-300">{t('auth_name_label')}</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <Input 
                          id="name-signup" 
                          placeholder="John Doe" 
                          className="pl-12 h-14 bg-white/5 border-white/10 text-white rounded-xl focus:ring-purple-500 focus:border-purple-500" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-signup" className="text-sm font-medium text-gray-300">{t('auth_email_label')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <Input 
                          id="email-signup" 
                          placeholder="email@example.com" 
                          className="pl-12 h-14 bg-white/5 border-white/10 text-white rounded-xl focus:ring-purple-500 focus:border-purple-500" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-signup" className="text-sm font-medium text-gray-300">{t('auth_password_label')}</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <Input 
                          id="password-signup" 
                          type={showPassword ? "text" : "password"} 
                          className="pl-12 pr-12 h-14 bg-white/5 border-white/10 text-white rounded-xl focus:ring-purple-500 focus:border-purple-500" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    <Button 
                      className="w-full h-14 bg-purple-600 text-white hover:bg-purple-700 font-bold text-lg rounded-2xl shadow-xl transition-all active:scale-95 mt-2" 
                      onClick={() => handleEmailAuth('signup')}
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                      {isLoading ? t('auth_processing') : t('auth_create_account')}
                    </Button>
                  </TabsContent>

                  <TabsContent value="phone" className="space-y-4 outline-none">
                    <AnimatePresence mode="wait">
                      {!confirmationResult ? (
                        <motion.div
                          key="phone-input"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="phone-number" className="text-sm font-medium text-gray-300">{t('auth_phone_label')}</Label>
                            <div className="relative">
                              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                              <Input 
                                id="phone-number" 
                                placeholder="+91 98765 43210" 
                                className="pl-12 h-14 bg-white/5 border-white/10 text-white rounded-xl focus:ring-purple-500 focus:border-purple-500" 
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                              />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1">{t('auth_phone_disclaimer')}</p>
                          </div>
                          <Button 
                            className="w-full h-14 bg-purple-600 text-white hover:bg-purple-700 font-bold text-lg rounded-2xl shadow-xl transition-all active:scale-95" 
                            onClick={handlePhoneSignIn}
                            disabled={isLoading}
                          >
                            {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                            {isLoading ? t('auth_processing') : t('auth_send_otp')}
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="otp-input"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="otp" className="text-sm font-medium text-gray-300">{t('auth_otp_label')}</Label>
                            <div className="relative">
                              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                              <Input 
                                id="otp" 
                                placeholder="123456" 
                                className="pl-12 h-14 bg-white/5 border-white/10 text-white rounded-xl focus:ring-purple-500 focus:border-purple-500" 
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline"
                              className="flex-1 h-14 border-white/10 bg-white/5 rounded-2xl" 
                              onClick={() => setConfirmationResult(null)}
                            >
                              {t('auth_back_to_phone')}
                            </Button>
                            <Button 
                              className="flex-[2] h-14 bg-purple-600 text-white hover:bg-purple-700 font-bold text-lg rounded-2xl shadow-xl transition-all active:scale-95" 
                              onClick={handleVerifyOtp}
                              disabled={isLoading}
                            >
                              {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                              {isLoading ? t('auth_processing') : t('auth_verify_otp')}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
