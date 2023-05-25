import CryptoJS from 'crypto-js';

// 비밀번호 암호화
export const encodePass = password => {
  const encryptCipher = CryptoJS.AES.encrypt(
    password,
    CryptoJS.enc.Utf8.parse(process.env.VUE_APP_AES_SECRETKEY),
    {
      iv: CryptoJS.enc.Utf8.parse(process.env.VUE_APP_AES_IV),
      padding: CryptoJS.pad.Pkcs7, // default setting(없어도 됨)
      mode: CryptoJS.mode.CBC,
    },
  );
  return encryptCipher.toString();
};

export const decodePass = encryptPassword => {
  const decryptChipher = CryptoJS.AES.decrypt(
    encryptPassword,
    CryptoJS.enc.Utf8.parse(process.env.VUE_APP_AES_SECRETKEY),
    {
      iv: CryptoJS.enc.Utf8.parse(process.env.VUE_APP_AES_IV),
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    },
  );

  return decryptChipher.toString(CryptoJS.enc.Utf8);
};
