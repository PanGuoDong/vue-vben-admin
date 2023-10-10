import { defHttp } from '@/utils/http/axios';
import { passwordEncrption } from '../login/passwordEncrypt';

export interface UserVO {
  id: number;
  loginAccount: string;
  username: string;
  nickname: string;
  password: string;
  deptId: number;
  postId: number;
  email: string;
  mobile: string;
  sex: number;
  avatar: string;
  loginIp: string;
  status: number;
  remark: string;
  loginDate: Date;
  createTime: Date;
}

export interface UserPageReqVO extends PageParam {
  deptId?: number;
  userName?: string;
  userId?: string;
  useFlag?: number;
}

export interface UserExportReqVO {
  code?: string;
  name?: string;
  status?: number;
  createTime?: Date[];
}

// 查询用户管理列表
export function getUserPage(params: UserPageReqVO) {
  return defHttp.get({ url: '/SysUser/GetPageUsers', params });
}

// 新增用户
export function createUser(data: UserVO) {
  data.password = passwordEncrption(data.password);
  return defHttp.post({ url: '/SysUser/AddSystemUser', data });
}

// 修改用户
export function updateUser(userId: string, data: UserVO) {
  return defHttp.put({ url: `/SysUser/UpdateSysUser?userId=${userId}`, data });
}

// 用户密码重置
export function resetUserPwd(userId: string, password: string) {
  password = encodeURIComponent(passwordEncrption(password));
  return defHttp.put({
    url: `/SysUser/UpdateSysUserPassword?userId=${userId}&password=${password}`,
  });
}

// 用户状态修改
export function updateUserStatus(userId: string, status: number) {
  return defHttp.put({
    url: `/SysUser/UpdateSysUserStatus?userId=${userId}&validStatus=${status}`,
  });
}

// 获取用户精简信息列表
export function getListSimpleUsers() {
  return defHttp.get({ url: '/system/user/list-all-simple' });
}
