import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePageTracker } from '@/hooks/useActivityTracker';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  ImagePlus,
  Send,
  MapPin,
  Calendar,
  Heart,
  Trash2,
  Loader2,
  BookOpen,
  Plane,
} from 'lucide-react';

interface DiaryEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  destination: string;
  image_url: string | null;
  created_at: string;
  author_name?: string;
  author_avatar?: string;
}

const TravelDiaries = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  usePageTracker('Travel Diaries');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [destination, setDestination] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('travel_diaries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error loading diaries', description: error.message, variant: 'destructive' });
    } else if (data) {
      // Fetch author profiles
      const userIds = [...new Set(data.map((d) => d.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) ?? []);
      const enriched = data.map((d) => ({
        ...d,
        author_name: profileMap.get(d.user_id)?.full_name || 'Traveler',
        author_avatar: profileMap.get(d.user_id)?.avatar_url || undefined,
      }));
      setEntries(enriched);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: 'Please sign in', description: 'You need to be logged in to post.', variant: 'destructive' });
      return;
    }
    if (!title.trim() || !content.trim() || !destination.trim()) {
      toast({ title: 'Missing fields', description: 'Please fill in all fields.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    let imageUrl: string | null = null;

    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('diary-images')
        .upload(path, imageFile);

      if (uploadError) {
        toast({ title: 'Image upload failed', description: uploadError.message, variant: 'destructive' });
        setSubmitting(false);
        return;
      }
      const { data: urlData } = supabase.storage.from('diary-images').getPublicUrl(path);
      imageUrl = urlData.publicUrl;
    }

    const { error } = await supabase.from('travel_diaries').insert({
      user_id: user.id,
      title: title.trim(),
      content: content.trim(),
      destination: destination.trim(),
      image_url: imageUrl,
    });

    if (error) {
      toast({ title: 'Failed to post', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Posted! ✨', description: 'Your travel diary has been shared.' });
      setTitle('');
      setContent('');
      setDestination('');
      setImageFile(null);
      setImagePreview(null);
      setShowForm(false);
      fetchEntries();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('travel_diaries').delete().eq('id', id);
    if (error) {
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    } else {
      setEntries((prev) => prev.filter((e) => e.id !== id));
      toast({ title: 'Deleted', description: 'Diary entry removed.' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-8 w-8" />
            <h1 className="text-3xl md:text-4xl font-bold">Wanderlust Chronicles</h1>
          </div>
          <p className="text-primary-foreground/80 text-lg max-w-xl">
            Share your travel stories, photos, and memories with fellow explorers.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* New Post Button / Form */}
        {user && !showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="w-full mb-8 bg-gradient-gold hover:opacity-90 text-accent-foreground h-14 text-base font-semibold gap-2"
          >
            <Plane className="h-5 w-5" />
            Share Your Travel Story
          </Button>
        )}

        {!user && (
          <Card className="p-6 mb-8 text-center bg-card border-border">
            <p className="text-muted-foreground mb-3">Sign in to share your travel experiences</p>
            <Button asChild className="bg-gradient-primary">
              <Link to="/auth">Sign In</Link>
            </Button>
          </Card>
        )}

        {showForm && (
          <Card className="p-6 mb-8 border-border bg-card animate-fade-in">
            <h2 className="text-lg font-semibold text-foreground mb-4">New Travel Diary Entry</h2>
            <div className="space-y-4">
              <Input
                placeholder="Give your story a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
              />
              <Input
                placeholder="Where did you go? (e.g., Manali, Kerala)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
              />
              <Textarea
                placeholder="Tell us about your experience... What did you see, eat, feel?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground resize-none"
              />

              {/* Image upload */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ImagePlus className="h-5 w-5" />
                  {imageFile ? imageFile.name : 'Add a photo'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-3 rounded-xl max-h-48 object-cover w-full"
                  />
                )}
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => { setShowForm(false); setImageFile(null); setImagePreview(null); }}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={submitting} className="bg-gradient-primary gap-2">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Publish
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Entries Feed */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground text-lg">No stories yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => (
              <Card key={entry.id} className="overflow-hidden border-border bg-card hover:shadow-card-hover transition-shadow duration-300">
                {entry.image_url && (
                  <img
                    src={entry.image_url}
                    alt={entry.title}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-6">
                  {/* Author row */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {entry.author_avatar ? (
                        <img src={entry.author_avatar} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-primary font-semibold text-sm">
                          {entry.author_name?.charAt(0)?.toUpperCase() || 'T'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{entry.author_name}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(entry.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {entry.destination}
                        </span>
                      </div>
                    </div>
                    {user?.id === entry.user_id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(entry.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2">{entry.title}</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelDiaries;
