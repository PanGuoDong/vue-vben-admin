import { defHttp } from '@/utils/http/axios';

// 院区字典VO
export interface HospitalDicVO {
  hospitalId?: string;
  hospitalName?: string;
  hospitalAbbreviation: string;
  hospitalCategoryCode?: string;
  hospitalAddress: string;
  organizationCode: string;
  organizationName: string;
  tenantId: number;
  useFlag?: boolean;
  createdBy: string;
  createdTime: Date;
  updatedBy: string;
  updatedTime: Date;
}

// 查询院区字典列表
export const getHospitalDics = () => {
  return defHttp.get<HospitalDicVO[]>({ url: '/HospitalDic/GetValidHospitalDics' });
};
