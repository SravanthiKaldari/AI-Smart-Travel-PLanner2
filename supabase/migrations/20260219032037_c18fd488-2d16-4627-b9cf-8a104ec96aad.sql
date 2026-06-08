
-- Create travel diaries table
CREATE TABLE public.travel_diaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  destination TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.travel_diaries ENABLE ROW LEVEL SECURITY;

-- Everyone can read diaries (public feed)
CREATE POLICY "Anyone can view travel diaries"
ON public.travel_diaries
FOR SELECT
USING (true);

-- Users can create their own diaries
CREATE POLICY "Users can create their own diaries"
ON public.travel_diaries
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own diaries
CREATE POLICY "Users can update their own diaries"
ON public.travel_diaries
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own diaries
CREATE POLICY "Users can delete their own diaries"
ON public.travel_diaries
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_travel_diaries_updated_at
BEFORE UPDATE ON public.travel_diaries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for diary images
INSERT INTO storage.buckets (id, name, public) VALUES ('diary-images', 'diary-images', true);

-- Storage policies
CREATE POLICY "Diary images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'diary-images');

CREATE POLICY "Users can upload diary images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'diary-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their diary images"
ON storage.objects FOR DELETE
USING (bucket_id = 'diary-images' AND auth.uid()::text = (storage.foldername(name))[1]);
