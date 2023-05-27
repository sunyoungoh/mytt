import { supabase } from '@/utils/supabase.js';
import { getEncodeKey } from '@/utils/crypto.js';

// 네이버 인증정보 업데이트
export const updateNaverAuth = async (email, password, brandId) => {
  // 비밀번호 암호화
  const encrypted = getEncodeKey(password);

  // 인증정보 DB 저장
  const { data, error } = await supabase
    .from('user')
    .update({
      naver_email: email,
      naver_password: encrypted,
    })
    .eq('brand_id', brandId)
    .select();

  if (data.length > 0) {
    return data[0];
  } else {
    console.log(error);
  }
};

// 네이버 인증정보 조회
export const getNaverAuth = async brandId => {
  const { data, error } = await supabase
    .from('user')
    .select()
    .eq('brand_id', brandId);

  if (error) {
    console.log(error);
  }
  // 네이버 인증 정보가 있으면 return
  if (data.length > 0) {
    const naverAuth = data[0];
    const userEmail = naverAuth.naver_email;
    const userPass = naverAuth.naver_password;

    return { userEmail, userPass };
  }
};
