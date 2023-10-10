import { defHttp } from '@/utils/http/axios';
import { GetUserInfoModel, LoginParams, LoginResultModel } from '../model/userModel';
import { ErrorMessageMode } from '/#/axios';
import { passwordEncrption } from './passwordEncrypt';

// 查询用户详情
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>(
    { url: '/SysUser/GetCurrentUser' },
    { errorMessageMode: 'none' },
  );
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  params.password = passwordEncrption(params.password);
  return defHttp.post<LoginResultModel>(
    {
      url: '/SysUserLogin/LoginWithJWT',
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function doLogout(loginId: number) {
  return defHttp.post({ url: `/SysUserLogin/Logout?loginId=${loginId}` });
}
