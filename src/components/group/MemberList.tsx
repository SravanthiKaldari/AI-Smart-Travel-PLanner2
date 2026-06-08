import { GroupMember, MemberLocation, haversineDistance } from '@/hooks/useGroupTravel';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { MapPin, MapPinOff, Shield, User } from 'lucide-react';

interface Props {
  members: GroupMember[];
  locations: Record<string, MemberLocation>;
}

const MemberList = ({ members, locations }: Props) => {
  const { user } = useAuth();

  // Calculate group center
  const locEntries = Object.values(locations);
  let centerLat = 0, centerLon = 0;
  locEntries.forEach(l => { centerLat += l.latitude; centerLon += l.longitude; });
  if (locEntries.length > 0) {
    centerLat /= locEntries.length;
    centerLon /= locEntries.length;
  }

  return (
    <div className="space-y-3">
      {members.map((m) => {
        const loc = locations[m.user_id];
        const dist = loc ? haversineDistance(loc.latitude, loc.longitude, centerLat, centerLon) : null;
        const name = m.profile?.full_name || m.profile?.email || 'Member';
        const isMe = m.user_id === user?.id;

        return (
          <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                {m.role === 'admin' ? <Shield className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 text-muted-foreground" />}
              </div>
              <div>
                <p className="font-medium text-sm">{name}{isMe ? ' (You)' : ''}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant={m.role === 'admin' ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0">
                    {m.role}
                  </Badge>
                  {m.location_sharing_enabled ? (
                    <span className="flex items-center gap-1 text-[10px] text-green-600"><MapPin className="w-3 h-3" /> Sharing</span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><MapPinOff className="w-3 h-3" /> Off</span>
                  )}
                </div>
              </div>
            </div>
            {dist !== null && (
              <span className={`text-xs font-medium ${dist > 1 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {dist > 1 ? '⚠️ ' : ''}{dist.toFixed(1)}km
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MemberList;
