import { useState, useEffect } from 'react';
import { X, Download, Share, Plus, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const STORAGE_KEY = 'pwa-install-prompt-state';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

interface InstallState {
  dismissed: boolean;
  dismissedAt: number | null;
  installed: boolean;
}

const getStoredState = (): InstallState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading PWA state:', e);
  }
  return { dismissed: false, dismissedAt: null, installed: false };
};

const setStoredState = (state: InstallState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving PWA state:', e);
  }
};

const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

const isInStandaloneMode = (): boolean => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
};

export const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if we should show the prompt
    const checkShowPrompt = () => {
      const state = getStoredState();
      
      // Already installed or running as PWA
      if (state.installed || isInStandaloneMode()) {
        return false;
      }
      
      // Not a mobile device
      if (!isMobileDevice()) {
        return false;
      }
      
      // Check if dismissed recently
      if (state.dismissed && state.dismissedAt) {
        const timeSinceDismiss = Date.now() - state.dismissedAt;
        if (timeSinceDismiss < DISMISS_DURATION) {
          return false;
        }
      }
      
      return true;
    };

    // Handler for beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      if (checkShowPrompt()) {
        // Delay showing the prompt for better UX
        setTimeout(() => setShowPrompt(true), 2000);
      }
    };

    // Handler for app installed event
    const handleAppInstalled = () => {
      setStoredState({ dismissed: false, dismissedAt: null, installed: true });
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // For iOS, show prompt after delay if conditions are met
    if (isIOS() && checkShowPrompt()) {
      setTimeout(() => setShowPrompt(true), 2000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (isIOS()) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setStoredState({ dismissed: false, dismissedAt: null, installed: true });
        setShowPrompt(false);
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setStoredState({ 
      dismissed: true, 
      dismissedAt: Date.now(), 
      installed: false 
    });
    setShowPrompt(false);
    setShowIOSGuide(false);
  };

  if (!showPrompt) return null;

  return (
    <>
      {/* Main Install Banner */}
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[100] transform transition-transform duration-500 ease-out",
          showPrompt ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="mx-4 mb-4 bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-primary px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-foreground text-sm">
                  Install Smart Travel
                </h3>
                <p className="text-primary-foreground/80 text-xs">
                  Get the full app experience
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-4">
            <ul className="text-sm text-muted-foreground space-y-2 mb-4">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                Works offline with saved data
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                Fast loading & smooth experience
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                Quick access from home screen
              </li>
            </ul>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleDismiss}
              >
                Later
              </Button>
              <Button
                className="flex-1 bg-gradient-primary"
                onClick={handleInstall}
                disabled={isInstalling}
              >
                {isInstalling ? (
                  "Installing..."
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Install Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* iOS Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center bg-foreground/50 backdrop-blur-sm">
          <div 
            className="w-full max-w-lg mx-4 mb-4 bg-card rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300"
          >
            <div className="bg-gradient-primary px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-primary-foreground">
                Install on iPhone/iPad
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-primary-foreground" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">
                    Tap the Share button
                  </p>
                  <div className="inline-flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
                    <Share className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Share</span>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">
                    Scroll down and tap "Add to Home Screen"
                  </p>
                  <div className="inline-flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
                    <Plus className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Add to Home Screen</span>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Tap "Add" in the top right corner
                  </p>
                </div>
              </div>
              
              <Button
                className="w-full bg-gradient-primary"
                onClick={() => setShowIOSGuide(false)}
              >
                Got it!
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAInstallPrompt;
