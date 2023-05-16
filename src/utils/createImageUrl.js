import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/utils/supabase.js';

export const createImageUrl = async file => {
  console.log(file);
  try {
    const blob = file;

    if (!blob) {
      return;
    }
    const key = uuidv4();
    const bucket = 'images'; // supabase 에 미리 만들어둔 public 버킷 이름

    await supabase.storage.from(bucket).upload(key, blob, {
      cacheControl: '3600',
    });

    const { publicUrl } = await supabase.storage.from(bucket).getPublicUrl(key)
      .data;
    console.log(publicUrl);

    return publicUrl;
  } catch (err) {
    console.log(err);
  }
};
