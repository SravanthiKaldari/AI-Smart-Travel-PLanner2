import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface GroupMessage {
  id: string;
  group_id: string;
  sender_id: string;
  message_text: string;
  created_at: string;
  sender_name?: string;
}

export interface MemberLocation {
  id: string;
  group_id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  created_at: string;
  member_name?: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: string;
  location_sharing_enabled: boolean;
  joined_at: string;
  profile?: { full_name: string | null; email: string | null; avatar_url: string | null };
}

export interface TravelGroup {
  id: string;
  destination_name: string;
  creator_id: string;
  invite_code: string;
  trip_start_date: string | null;
  trip_end_date: string | null;
  created_at: string;
}

export function useGroupMessages(groupId: string) {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!groupId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('group_messages')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true })
        .limit(200);
      if (data) setMessages(data);
    };
    fetchMessages();

    const channel = supabase
      .channel(`group-messages-${groupId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'group_messages',
        filter: `group_id=eq.${groupId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as GroupMessage]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [groupId]);

  const sendMessage = useCallback(async (text: string) => {
    if (!user || !text.trim()) return;
    await supabase.from('group_messages').insert({
      group_id: groupId,
      sender_id: user.id,
      message_text: text.trim(),
    });
  }, [groupId, user]);

  return { messages, sendMessage };
}

export function useMemberLocations(groupId: string) {
  const [locations, setLocations] = useState<Record<string, MemberLocation>>({});
  const watchRef = useRef<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!groupId) return;

    const channel = supabase
      .channel(`member-locations-${groupId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'member_locations',
        filter: `group_id=eq.${groupId}`,
      }, (payload) => {
        const loc = payload.new as MemberLocation;
        setLocations(prev => ({ ...prev, [loc.user_id]: loc }));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [groupId]);

  const startSharing = useCallback(() => {
    if (!user || !navigator.geolocation) return;

    const sendLocation = (pos: GeolocationPosition) => {
      supabase.from('member_locations').insert({
        group_id: groupId,
        user_id: user.id,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    };

    watchRef.current = navigator.geolocation.watchPosition(sendLocation, console.error, {
      enableHighAccuracy: true,
      maximumAge: 5000,
    });

    // Also update membership
    supabase.from('group_members')
      .update({ location_sharing_enabled: true })
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .then();
  }, [groupId, user]);

  const stopSharing = useCallback(() => {
    if (watchRef.current !== null) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
    if (user) {
      supabase.from('group_members')
        .update({ location_sharing_enabled: false })
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .then();
    }
  }, [groupId, user]);

  return { locations, startSharing, stopSharing };
}

// Haversine distance in km
export function haversineDistance(
  lat1: number, lon1: number, lat2: number, lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
