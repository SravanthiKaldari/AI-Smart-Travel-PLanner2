import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const trackActivity = async (action: string, page?: string, destination?: string, details?: Record<string, unknown>) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('user_activity').insert([{
      user_id: user.id,
      action,
      page: page || undefined,
      destination: destination || undefined,
      details: (details || {}) as any,
    }]);
  } catch (error) {
    // Silently fail - don't disrupt user experience
    console.error('Activity tracking error:', error);
  }
};

export const usePageTracker = (pageName: string) => {
  useEffect(() => {
    trackActivity('page_view', pageName);
  }, [pageName]);
};
