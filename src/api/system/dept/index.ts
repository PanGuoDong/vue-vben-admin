import { defHttp } from '@/utils/http/axios';

// 科室字典信息VO
export interface DeptDicVO {
  deptId?: string;
  hospitalId?: string;
  deptName?: string;
  deptNamePy: string;
  deptSort?: number;
  deptParentId: string;
  deptCategoryCode?: number;
  deptGroupId: string;
  useFlag?: boolean;
  createdBy: string;
  createdTime: Date;
  updatedBy: string;
  updatedTime: Date;
}

// 查询科室字典信息列表
export const getAllowLoginDeptDics = () => {
  return defHttp.get<DeptDicVO[]>({ url: '/DeptDic/GetAllowLoginDepts' });
};

// 查询科室字典信息列表
export const getDeptDics = () => {
  return defHttp.get<DeptDicVO[]>({ url: '/DeptDic/GetAllDepts' });
};

export const getSimpleDeptDics = () => {
  return defHttp.get({ url: '/DeptDic/GetAllowLoginDepts' });
};

// 新增科室字典信息
export const createDeptDic = (data: DeptDicVO) => {
  return defHttp.post({ url: '/DeptDic/AddDeptDic', data });
};

// 修改科室字典信息
export const updateDeptDic = (data: DeptDicVO) => {
  return defHttp.put({ url: `/DeptDic/UpdateDeptDic?deptId=${data.deptId}`, data });
};

// 删除科室字典信息
export const deleteDeptDic = (deptId: string) => {
  return defHttp.delete({ url: `/DeptDic/DeleteDeptDic?deptId=${deptId}` });
};
