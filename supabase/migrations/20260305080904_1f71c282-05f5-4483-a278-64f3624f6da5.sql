
-- 1. Create travel_groups table
CREATE TABLE public.travel_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_name text NOT NULL,
  wishlist_id uuid REFERENCES public.wishlists(id) ON DELETE SET NULL,
  creator_id uuid NOT NULL,
  invite_code text NOT NULL UNIQUE DEFAULT substr(md5(random()::text), 1, 8),
  trip_start_date date,
  trip_end_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Create group_members table
CREATE TABLE public.group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.travel_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  location_sharing_enabled boolean NOT NULL DEFAULT false,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- 3. Create group_messages table
CREATE TABLE public.group_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.travel_groups(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  message_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Create member_locations table
CREATE TABLE public.member_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.travel_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Enable RLS on all tables
ALTER TABLE public.travel_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_locations ENABLE ROW LEVEL SECURITY;

-- 6. Helper function: check if user is a member of a group
CREATE OR REPLACE FUNCTION public.is_group_member(_user_id uuid, _group_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE user_id = _user_id AND group_id = _group_id
  )
$$;

-- 7. RLS for travel_groups
CREATE POLICY "Members can view their groups" ON public.travel_groups
  FOR SELECT TO authenticated
  USING (public.is_group_member(auth.uid(), id));

CREATE POLICY "Authenticated users can create groups" ON public.travel_groups
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creator can update group" ON public.travel_groups
  FOR UPDATE TO authenticated
  USING (auth.uid() = creator_id);

CREATE POLICY "Creator can delete group" ON public.travel_groups
  FOR DELETE TO authenticated
  USING (auth.uid() = creator_id);

-- 8. RLS for group_members
CREATE POLICY "Members can view group members" ON public.group_members
  FOR SELECT TO authenticated
  USING (public.is_group_member(auth.uid(), group_id));

CREATE POLICY "Users can join groups" ON public.group_members
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own membership" ON public.group_members
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can delete members" ON public.group_members
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_members.group_id
        AND gm.user_id = auth.uid()
        AND gm.role = 'admin'
    )
    OR auth.uid() = user_id
  );

-- 9. RLS for group_messages
CREATE POLICY "Members can view messages" ON public.group_messages
  FOR SELECT TO authenticated
  USING (public.is_group_member(auth.uid(), group_id));

CREATE POLICY "Members can send messages" ON public.group_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND public.is_group_member(auth.uid(), group_id)
  );

-- 10. RLS for member_locations
CREATE POLICY "Members can view locations" ON public.member_locations
  FOR SELECT TO authenticated
  USING (public.is_group_member(auth.uid(), group_id));

CREATE POLICY "Members can insert own location" ON public.member_locations
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND public.is_group_member(auth.uid(), group_id)
  );

-- 11. Enable realtime for chat and locations
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.member_locations;

-- 12. Allow public SELECT on travel_groups for join page (by invite_code only)
CREATE POLICY "Anyone can lookup group by invite code" ON public.travel_groups
  FOR SELECT TO authenticated
  USING (true);
