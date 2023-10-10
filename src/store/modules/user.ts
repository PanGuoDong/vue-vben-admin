import { h } from 'vue';
import { defineStore } from 'pinia';
import type { RouteRecordRaw } from 'vue-router';

import { store } from '@/store';
import { router } from '@/router';
import { PageEnum } from '@/enums/pageEnum';
import {
  ACCESS_TOKEN_KEY,
  LOGIN_ID_KEY,
  REFRESH_TOKEN_KEY,
  ROLES_KEY,
  USER_INFO_KEY,
} from '@/enums/cacheEnum';
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';
import { usePermissionStore } from '@/store/modules/permission';
import { useI18n } from '@/hooks/web/useI18n';
import { useMessage } from '@/hooks/web/useMessage';
import { getAuthCache, setAuthCache } from '@/utils/auth';
import { doLogout, getUserInfo, loginApi } from '@/api/system/login';

import { isArray } from '@/utils/is';
import { GetUserInfoModel, LoginParams } from '/@/api/system/model/userModel';
import { ErrorMessageMode } from '/#/axios';
import { getMenuList } from '/@/api/system/menu';

interface UserState {
  loginId: number;
  userInfo: Nullable<GetUserInfoModel>;
  accessToken?: string;
  refreshToken?: string;
  roleList: string[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

export const useUserStore = defineStore('app-user', {
  state: (): UserState => ({
    loginId: 0,
    // user info
    userInfo: null,
    // token
    accessToken: undefined,
    refreshToken: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getLoginId(state): number {
      return state.loginId || getAuthCache<number>(LOGIN_ID_KEY);
    },
    getUserInfo(state): GetUserInfoModel {
      return state.userInfo || getAuthCache<GetUserInfoModel>(USER_INFO_KEY) || {};
    },
    getAccessToken(state): string {
      return state.accessToken || getAuthCache<string>(ACCESS_TOKEN_KEY);
    },
    getRefreshToken(state): string {
      return state.refreshToken || getAuthCache<string>(REFRESH_TOKEN_KEY);
    },
    getRoleList(state): string[] {
      return state.roleList.length > 0 ? state.roleList : getAuthCache<string[]>(ROLES_KEY);
    },
    getSessionTimeout(state): boolean {
      return !!state.sessionTimeout;
    },
    getLastUpdateTime(state): number {
      return state.lastUpdateTime;
    },
  },
  actions: {
    setLoginId(loginId: number) {
      this.loginId = loginId;
      setAuthCache(LOGIN_ID_KEY, loginId);
    },
    setAccessToken(info: string | undefined) {
      this.accessToken = info || ''; // for null or undefined value
      setAuthCache(ACCESS_TOKEN_KEY, info);
    },
    setRefreshToken(info: string | undefined) {
      this.refreshToken = info || ''; // for null or undefined value
      setAuthCache(REFRESH_TOKEN_KEY, info);
    },
    setRoleList(roleList: string[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: GetUserInfoModel | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.accessToken = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const data = await loginApi(loginParams, mode);
        const { accessToken, refreshToken } = data;
        this.setLoginId(data.loginId);
        // save token
        this.setAccessToken(accessToken);
        this.setRefreshToken(refreshToken);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
      if (!this.getAccessToken) return null;
      // get user info
      const userInfo = await this.getUserInfoAction();

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }
        goHome && (await router.replace(PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    async getUserInfoAction(): Promise<GetUserInfoModel | null> {
      if (!this.getAccessToken) return null;
      const userInfo = await getUserInfo();
      const { userRoles: roles } = userInfo;
      if (isArray(roles)) {
        const roleList = roles.map((item) => item.roleId?.toString()) as string[];
        this.setRoleList(roleList);
      } else {
        userInfo.userRoles = [];
        this.setRoleList([]);
      }
      // 用户权限菜单
      const userMenus = await getMenuList();
      userInfo.userMenus = userMenus;

      this.setUserInfo(userInfo);
      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getAccessToken) {
        try {
          await doLogout(this.getLoginId);
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setAccessToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
