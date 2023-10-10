import { DeptDicVO } from '../dept';
import { StandardMenuVO } from '../menu';
import { SysRoleVO } from '../role';

/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  tenantId: number | undefined;
  userId: string;
  password: string;
  hospitalId: string;
  deptId: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  loginId: number;
  tenantId: number | undefined;
  userId: string;
  userName: string;
  password: string;
  accessToken: string;
  refreshToken: string;
  userDeptRights: string[];
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  userId?: string;
  userName?: string;
  userNamePy: string;
  idNumber: string;
  avatar: string;
  sex: string;
  phone: string;
  password?: string;
  caAuthenticationFlag: string;
  signaturePicture: string;
  ssoUserId: string;
  userDeptId: string;
  useFlag?: boolean;
  userRoles: SysRoleVO[];
  deptAuthority: DeptDicVO[];
  permissions: [];
  userMenus: StandardMenuVO[];
}
