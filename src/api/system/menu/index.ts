import { reactive, ref } from 'vue';
import { defHttp } from '@/utils/http/axios';

export interface StandardMenuVO {
  id: number;
  name: string;
  // permission: string
  sort: number | undefined;
  parentId: number;
  path: string;
  icon: string | undefined;
  component: string | undefined;
  componentName: string | undefined;
  visible: boolean;
  keepAlive: boolean;
  children: StandardMenuVO[] | undefined;
}

/**
 * @description: Get user menu based on id
 */

export async function getMenuList() {
  const menuData = await defHttp.get({
    url: '/SysMenuModule/GetSysModuleMenus?onlyValid=true&clientType=3',
  });
  const menuTree = reactive<StandardMenuVO[]>([]);

  if (menuData) {
    menuData.forEach((module) => {
      const menuModule = reactive<StandardMenuVO>({
        id: module.moduleId,
        parentId: 0,
        name: module.moduleName,
        path: `/${module.moduleCode.toLowerCase()}`,
        icon: '',
        sort: module.moduleSort,
        component: '',
        componentName: '',
        visible: true,
        keepAlive: true,
        children: undefined,
      });

      const menuGroups = ref<StandardMenuVO[]>([]);
      if (module.menuGroups) {
        module.menuGroups.forEach((group) => {
          const menuGroup = reactive<StandardMenuVO>({
            id: group.menuGroupId,
            parentId: group.moduleId,
            name: group.menuGroupName,
            path: group.menuGroupCode.toLowerCase(),
            icon: '',
            sort: group.menuGroupSort,
            component: '',
            componentName: '',
            visible: true,
            keepAlive: true,
            children: undefined,
          });

          const groupMenus = ref<StandardMenuVO[]>([]);
          if (group.menus) {
            group.menus.forEach((menu) => {
              const menuRoute = reactive<StandardMenuVO>({
                id: menu.menuId,
                parentId: menu.menuGroupId,
                name: menu.menuName,
                path: menu.menuPath.toLowerCase(),
                icon: '',
                sort: menu.menuSort,
                component: menu.menuComponent,
                componentName: menu.menuComponentName,
                visible: true,
                keepAlive: true,
                children: undefined,
              });
              groupMenus.value?.push(menuRoute);
            });
            menuGroup.children = groupMenus.value;
          }
          menuGroups.value.push(menuGroup);
        });
      }
      menuModule.children = menuGroups.value;
      menuTree.push(menuModule);
    });
  }

  return menuTree;
}
