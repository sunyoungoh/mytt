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

export const uploadFile = async (zipFile, optionCode, brandId, itemId) => {
  const time = Date.now();

  // 파일 이름 생성
  const fileName = `${brandId}_${itemId}_${optionCode}_${time}.zip`;
  const bucket = 'zip'; // 저장 공간

  try {
    // 파일 저장
    let { data, error } = await supabase.storage
      .from(bucket)
      .upload(`${brandId}/${fileName}`, zipFile, {
        cacheControl: '3600',
      });

    if (error) {
      console.log('업로드 실패!', error);
      return 'fail';
    }
    // 업로드 성공 시 기존 파일 삭제
    else {
      console.log('업로드 성공!', data.path);

      // 검색할 파일 이름
      const searchFileName = `${brandId}_${itemId}_${optionCode}`;

      // 기존 파일 찾기
      let beforeFiles = await supabase.storage.from(bucket).list(brandId, {
        offset: 1,
        sortBy: { column: 'updated_at', order: 'desc' },
        search: searchFileName,
      });
      console.log('기존 파일 리스트', beforeFiles);

      // 파일 삭제
      if (beforeFiles) {
        console.log('기존 파일 삭제 시작');
        beforeFiles.data.map(async item => {
          await supabase.storage.from(bucket).remove(`${brandId}/${item.name}`);
        });
        console.log('기존 파일 삭제 끝');
      }
      return 'success';
    }
  } catch (error) {
    console.log('업로드 실패!', error);
    return 'fail';
  }
};

const lastUploadFile = async (bucket, brandId, searchFileName) => {
  //  파일 검색 후 가장 최근 파일 하나만 가져오기
  const { data } = await supabase.storage.from(bucket).list(brandId, {
    limit: 1,
    sortBy: { column: 'updated_at', order: 'desc' },
    search: searchFileName,
  });
  console.log('최근 업로드 파일', data);
  return data;
};

export const downloadFile = async (brandId, itemId, optionCode) => {
  // 검색할 파일 이름
  const searchFileName = `${brandId}_${itemId}_${optionCode}`;
  const bucket = 'zip';

  //  파일 검색 후 가장 최근 파일 하나만 가져오기
  const data = await lastUploadFile(bucket, brandId, searchFileName);

  // 파일이 있으면 다운로드
  if (data.length > 0) {
    const fileName = data[0].name;
    const filePath = `${brandId}/${data[0].name}`;

    const { publicUrl } = await supabase.storage
      .from(bucket)
      .getPublicUrl(filePath, {
        download: true,
      }).data;

    return { result: 'success', filePath, fileName, publicUrl };
  } else {
    return { result: 'fail' };
  }
};

export const deleteFile = async (brandId, itemId, optionCode) => {
  // 검색할 파일 이름
  const searchFileName = `${brandId}_${itemId}_${optionCode}`;
  const bucket = 'zip';

  //  파일 검색 후 가장 최근 파일 하나만 가져오기
  const data = await lastUploadFile(bucket, brandId, searchFileName);

  // 파일이 있으면 삭제
  if (data.length > 0) {
    const filePath = `${brandId}/${data[0].name}`;
    const deleteResult = await supabase.storage.from(bucket).remove(filePath);
    // 삭제된 데이터가 있으면 success, 오류가 났으면 fail
    return deleteResult.data.length > 0 ? 'success' : 'fail';
  } else {
    // 검색된 파일이 없을 시
    return 'success';
  }
};
