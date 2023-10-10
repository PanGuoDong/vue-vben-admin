import { defHttp } from '@/utils/http/axios';

// 系统角色VO
export interface SysRoleVO {
  roleId?: number;
  roleName?: string;
  useFlag?: boolean;
  createdBy: string;
  createdTime: Date;
  updatedBy: string;
  updatedTime: Date;
  roleMenuIds: number[];
}

export interface RolePageReqVO extends PageParam {
  roleName?: string;
  useFlag?: number;
}

export interface UpdateStatusReqVO {
  id: number;
  status: number;
}

export interface RoleExportReqVO {
  name?: string;
  code?: string;
  status?: number;
  createTime?: Date[];
}

// 查询角色列表
export function getRolePage(params: RolePageReqVO) {
  return defHttp.get({ url: '/SysRole/GetPageRoles', params });
}

// 查询角色（精简)列表
export function listSimpleRoles() {
  return defHttp.get({ url: '/SysRole/GetSysRoles?onlyValid=true' });
}

// 新增角色
export function createRole(data: SysRoleVO) {
  return defHttp.post({ url: '/SysRole/AddSysRole', data });
}

// 修改角色
export function updateRole(data: SysRoleVO) {
  return defHttp.put({ url: `/SysRole/UpdateSysRole?roleId=${data.roleId}`, data });
}

// 修改角色状态
export function updateRoleStatus(roleId: string, status: number) {
  return defHttp.put({
    url: `/SysRole/UpdateSysRoleStatus?roleId=${roleId}&validStatus=${status}`,
  });
}

// 删除角色
export function deleteRole(id: number) {
  return defHttp.delete({ url: '/SysRole/DeleteSysRole?roleId=' + id });
}
