import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';
import { showError } from '@/utils/toast';

interface AvatarUploadProps {
  userId: string;
  url: string | null;
  onUpload: (url: string) => void;
}

export const AvatarUpload = ({ userId, url, onUpload }: AvatarUploadProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setAvatarUrl(url);
  }, [url]);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      onUpload(publicUrl);
      setAvatarUrl(publicUrl);

    } catch (error: any) {
      showError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={avatarUrl ?? undefined} alt="User avatar" />
        <AvatarFallback>
          <User className="h-10 w-10" />
        </AvatarFallback>
      </Avatar>
      <div className="grid gap-2">
        <Button asChild variant="outline">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            {uploading ? 'Uploading...' : 'Upload'}
          </label>
        </Button>
        <Input
          id="avatar-upload"
          type="file"
          className="hidden"
          accept="image/png, image/jpeg"
          onChange={uploadAvatar}
          disabled={uploading}
        />
        <p className="text-sm text-muted-foreground">
          PNG or JPG. Max 5MB.
        </p>
      </div>
    </div>
  );
};