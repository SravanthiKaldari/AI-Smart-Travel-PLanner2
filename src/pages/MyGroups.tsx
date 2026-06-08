import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, MapPin, Users, Calendar, Plane, LogOut, User } from 'lucide-react';

interface GroupInfo {
  id: string;
  destination_name: string;
  trip_start_date: string | null;
  trip_end_date: string | null;
  invite_code: string;
  member_count?: number;
}

const MyGroups = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [groups, setGroups] = useState<GroupInfo[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      // Get group IDs the user is a member of
      const { data: memberships } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id);

      if (!memberships || memberships.length === 0) {
        setLoadingGroups(false);
        return;
      }

      const groupIds = memberships.map(m => m.group_id);
      const { data: groupsData } = await supabase
        .from('travel_groups')
        .select('*')
        .in('id', groupIds)
        .order('created_at', { ascending: false });

      if (groupsData) {
        // Get member counts
        const enriched = await Promise.all(groupsData.map(async (g) => {
          const { count } = await supabase
            .from('group_members')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', g.id);
          return { ...g, member_count: count || 0 };
        }));
        setGroups(enriched);
      }
      setLoadingGroups(false);
    };
    fetch();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Plane className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Smart Travel</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/profile"><User className="w-5 h-5" /></Link>
            </Button>
            <Button variant="outline" size="sm" onClick={async () => { await signOut(); navigate('/'); }}>
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold flex items-center gap-3 mb-8">
          <Users className="w-8 h-8 text-primary" /> My Travel Groups
        </h1>

        {loadingGroups ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i}><CardContent className="p-6 space-y-3">
                <Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2" />
              </CardContent></Card>
            ))}
          </div>
        ) : groups.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No groups yet</h2>
              <p className="text-muted-foreground mb-6">Create a group trip from your wishlist or join one with an invite code!</p>
              <div className="flex gap-3 justify-center">
                <Button asChild><Link to="/wishlist">Go to Wishlist</Link></Button>
                <Button variant="outline" asChild><Link to="/group/join">Join a Group</Link></Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map(g => (
              <Card
                key={g.id}
                className="cursor-pointer hover:shadow-card-hover transition-shadow"
                onClick={() => navigate(`/group/${g.id}`)}
              >
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" /> {g.destination_name}
                  </h3>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" /> {g.member_count} members
                    </span>
                    {g.trip_start_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {new Date(g.trip_start_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyGroups;
