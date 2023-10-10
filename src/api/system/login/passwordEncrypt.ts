import { DesEncryption, encryptByMd5 } from '@/utils/cipher';

const deskey = '2022pms-client1010';
const desEncryption = new DesEncryption({ key: deskey });

export const passwordEncrption = (text: string) => {
  return desEncryption.encrypt(encryptByMd5(text));
};
