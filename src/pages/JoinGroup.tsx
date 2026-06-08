import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Users, Loader2 } from 'lucide-react';

const JoinGroup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [code, setCode] = useState(searchParams.get('code') || '');
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  const handleJoin = async () => {
    if (!user || !code.trim()) return;
    setJoining(true);

    try {
      // Find group by invite code
      const { data: group, error } = await supabase
        .from('travel_groups')
        .select('id, destination_name')
        .eq('invite_code', code.trim())
        .single();

      if (error || !group) {
        toast({ title: 'Invalid invite code', variant: 'destructive' });
        setJoining(false);
        return;
      }

      // Check if already a member
      const { data: existing } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', group.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        navigate(`/group/${group.id}`);
        return;
      }

      // Join group
      const { error: joinError } = await supabase.from('group_members').insert({
        group_id: group.id,
        user_id: user.id,
        role: 'member',
      });

      if (joinError) throw joinError;

      toast({ title: `Joined "${group.destination_name}" group!` });
      navigate(`/group/${group.id}`);
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to join group', variant: 'destructive' });
    } finally {
      setJoining(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Users className="w-12 h-12 mx-auto text-primary mb-2" />
          <CardTitle>Join a Travel Group</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter invite code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
          />
          <Button className="w-full" onClick={handleJoin} disabled={joining || !code.trim()}>
            {joining && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Join Group
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinGroup;
