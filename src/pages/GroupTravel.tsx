import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useGroupMessages, useMemberLocations, TravelGroup, GroupMember } from '@/hooks/useGroupTravel';
import GroupChat from '@/components/group/GroupChat';
import GroupMap from '@/components/group/GroupMap';
import MemberList from '@/components/group/MemberList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, Copy, MapPin, MessageCircle, Users, Plane, 
  LogOut, User, Calendar, Navigation, LocateFixed, LocateOff, UserSearch
} from 'lucide-react';

const GroupTravel = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();

  const [group, setGroup] = useState<TravelGroup | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [showFellows, setShowFellows] = useState(false);

  const { messages, sendMessage } = useGroupMessages(groupId || '');
  const { locations, startSharing, stopSharing } = useMemberLocations(groupId || '');

  // Build member name map
  const memberNames: Record<string, string> = {};
  members.forEach(m => {
    memberNames[m.user_id] = m.profile?.full_name || m.profile?.email || 'Member';
  });

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!groupId || !user) return;

    const fetchGroup = async () => {
      const { data: groupData } = await supabase
        .from('travel_groups')
        .select('*')
        .eq('id', groupId)
        .single();

      if (!groupData) {
        toast({ title: 'Group not found', variant: 'destructive' });
        navigate('/dashboard');
        return;
      }
      setGroup(groupData);

      // Fetch members with profiles
      const { data: membersData } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', groupId);

      if (membersData && membersData.length > 0) {
        // Fetch profiles for members
        const userIds = membersData.map(m => m.user_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, full_name, email, avatar_url')
          .in('user_id', userIds);

        const profileMap: Record<string, any> = {};
        profiles?.forEach(p => { profileMap[p.user_id] = p; });

        const enriched = membersData.map(m => ({
          ...m,
          profile: profileMap[m.user_id] || null,
        }));
        setMembers(enriched);
      }

      setLoadingGroup(false);
    };

    fetchGroup();
  }, [groupId, user, navigate, toast]);

  const handleCopyInvite = () => {
    if (!group) return;
    const link = `${window.location.origin}/group/join?code=${group.invite_code}`;
    navigator.clipboard.writeText(link);
    toast({ title: 'Invite link copied!' });
  };

  const toggleSharing = () => {
    if (isSharing) {
      stopSharing();
      setIsSharing(false);
      toast({ title: 'Location sharing stopped' });
    } else {
      startSharing();
      setIsSharing(true);
      toast({ title: 'Sharing your live location' });
    }
  };

  const handleSignOut = async () => {
    stopSharing();
    await signOut();
    navigate('/');
  };

  if (loading || loadingGroup) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (!group) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <Button variant="ghost" onClick={() => navigate('/my-groups')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Groups
        </Button>

        {/* Group Overview */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  {group.destination_name}
                </CardTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  {group.trip_start_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(group.trip_start_date).toLocaleDateString()} 
                      {group.trip_end_date && ` – ${new Date(group.trip_end_date).toLocaleDateString()}`}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {members.length} members
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyInvite}>
                  <Copy className="w-4 h-4 mr-2" /> Copy Invite Link
                </Button>
                <Button
                  variant={isSharing ? 'destructive' : 'default'}
                  size="sm"
                  onClick={toggleSharing}
                >
                  {isSharing ? <LocateOff className="w-4 h-4 mr-2" /> : <LocateFixed className="w-4 h-4 mr-2" />}
                  {isSharing ? 'Stop Sharing' : 'Share Location'}
                </Button>
                <Button
                  variant={showFellows ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setShowFellows(!showFellows);
                    if (!showFellows && !isSharing) {
                      startSharing();
                      setIsSharing(true);
                      toast({ title: 'Location sharing started to find fellows' });
                    }
                  }}
                >
                  <UserSearch className="w-4 h-4 mr-2" />
                  {showFellows ? 'Hide Fellows' : 'Find Fellows'}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Find Fellows Panel */}
        {showFellows && Object.keys(locations).length > 0 && (
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserSearch className="w-5 h-5 text-primary" /> Fellow Travelers - Live
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(locations).map(([userId, loc]) => {
                  const name = memberNames[userId] || 'Member';
                  const isCurrentUser = userId === user?.id;
                  return (
                    <div key={userId} className={`flex items-center gap-3 p-3 rounded-xl border ${isCurrentUser ? 'border-primary/40 bg-primary/10' : 'border-border bg-background'}`}>
                      <div className={`w-3 h-3 rounded-full ${isCurrentUser ? 'bg-primary' : 'bg-green-500'} animate-pulse`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{name} {isCurrentUser && '(You)'}</p>
                        <p className="text-xs text-muted-foreground">
                          📍 {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          🕐 {new Date(loc.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0"
                        onClick={() => {
                          window.open(`https://www.google.com/maps/search/?api=1&query=${loc.latitude},${loc.longitude}`, '_blank');
                        }}
                      >
                        <Navigation className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
              {Object.keys(locations).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No fellow travelers are sharing their location yet. Ask them to enable location sharing!
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {showFellows && Object.keys(locations).length === 0 && (
          <Card className="border-dashed border-2 border-muted-foreground/20">
            <CardContent className="py-8 text-center">
              <UserSearch className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-muted-foreground">Waiting for fellow travelers to share their location...</p>
              <p className="text-xs text-muted-foreground mt-1">Ask your group members to click "Share Location"</p>
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="w-5 h-5" /> Group Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <GroupChat messages={messages} onSend={sendMessage} memberNames={memberNames} />
            </CardContent>
          </Card>

          {/* Map */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Navigation className="w-5 h-5" /> Live Location Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GroupMap locations={locations} memberNames={memberNames} />
            </CardContent>
          </Card>
        </div>

        {/* Member List */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5" /> Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MemberList members={members} locations={locations} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default GroupTravel;
