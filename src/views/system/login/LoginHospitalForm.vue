<script lang="ts" setup>
  import { computed, onMounted, reactive, ref, unref } from 'vue';

  import { Button, Checkbox, Col, Form, Input, Row, Select } from 'ant-design-vue';

  // import { GithubFilled, WechatFilled, AlipayCircleFilled, GoogleCircleFilled, TwitterCircleFilled } from '@ant-design/icons-vue'
  import LoginFormTitle from './LoginFormTitle.vue';

  import { LoginStateEnum, useFormRules, useFormValid, useLoginState } from './useLogin';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useMessage } from '@/hooks/web/useMessage';

  import { useUserStore } from '@/store/modules/user';
  import { usePermissionStore } from '@/store/modules/permission';

  import { useDesign } from '@/hooks/web/useDesign';

  import * as authUtil from '@/utils/auth';

  import type { HospitalDicVO } from '@/api/system/hospital';
  import { getHospitalDics } from '@/api/system/hospital';
  import type { DeptDicVO } from '@/api/system/dept';
  import { getAllowLoginDeptDics } from '@/api/system/dept';
  import { LOGIN_FORM_KEY } from '@/enums/cacheEnum';
  import { createLocalStorage } from '@/utils/cache';

  const ls = createLocalStorage();

  // import { Verify } from '@/components/Verifition'
  // import { getTenantIdByName } from '@/api/base/login'

  const FormItem = Form.Item;
  const InputPassword = Input.Password;

  const { t } = useI18n();
  const { notification, createErrorModal } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();

  // const { tenantEnable } = useGlobSetting()

  const { setLoginState, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const tenants = ref<HospitalDicVO[]>([]);
  const depts = ref<DeptDicVO[]>([]);
  const formRef = ref();
  const loading = ref(false);
  const rememberMe = ref(false);

  // const captchaType = ref('blockPuzzle') // blockPuzzle 滑块 clickWord 点击文字

  const formData = reactive({
    tenantId: 0,
    hospitalId: '',
    deptId: '',
    userId: '',
    password: '',
  });

  const { validForm } = useFormValid(formRef);

  // onKeyStroke('Enter', handleLogin);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  onMounted(() => {
    getTenants();
    getDepts();
    getCookie();
  });

  // 记住我
  function getCookie() {
    const loginFormCache = ls.get(LOGIN_FORM_KEY);
    if (loginFormCache) {
      rememberMe.value = loginFormCache.remember;
      if (rememberMe.value) {
        formData.tenantId = loginFormCache.tenantId;
        formData.hospitalId = loginFormCache.hospitalId;
        formData.deptId = loginFormCache.deptId;
        formData.userId = loginFormCache.userId;
        formData.password = loginFormCache.password;
      }
    }
  }

  // 获取租户ID
  async function getTenants() {
    tenants.value = await getHospitalDics();
  }

  // 获取科室
  async function getDepts() {
    depts.value = await getAllowLoginDeptDics();
  }

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;

      const loginTenantId = tenants.value.filter((t) => t.hospitalId === data.hospitalId)[0]
        .tenantId;
      data.tenantId = loginTenantId;
      data.remember = rememberMe.value;
      const userInfo = await userStore.login({
        tenantId: loginTenantId,
        password: data.password,
        userId: data.userId,
        hospitalId: data.hospitalId,
        deptId: data.deptId,
        mode: 'none', // 不要默认的错误提示
      });
      if (userInfo) {
        await permissionStore.changePermissionCode(userInfo.permissions);
        authUtil.setTenantId(loginTenantId.toString());
        if (data.remember) ls.set(LOGIN_FORM_KEY, data);
        else ls.remove(LOGIN_FORM_KEY);

        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.userName}`,
          duration: 3,
        });
      }
    } catch (error) {
      createErrorModal({
        title: t('sys.api.errorTip'),
        content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
    } finally {
      loading.value = false;
    }
  }
</script>

<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form
    v-show="getShow"
    ref="formRef"
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    @keypress.enter="handleLogin"
  >
    <FormItem name="hospitalId" class="enter-x">
      <!-- <Input
        v-if="tenantEnable === 'true'"
        size="large"
        v-model:value="formData.tenantName"
        :placeholder="t('sys.login.tenantName')"
        class="fix-auto-fill"
      /> -->
      <Select
        v-model:value="formData.hospitalId"
        :placeholder="t('sys.loginHospital.choseHopital')"
        :options="tenants"
        :field-names="{ label: 'hospitalName', value: 'hospitalId' }"
      />
    </FormItem>
    <FormItem name="deptId" class="enter-x">
      <Select
        v-model:value="formData.deptId"
        :placeholder="t('sys.loginHospital.choseDept')"
        :options="depts"
        :field-names="{ label: 'deptName', value: 'deptId' }"
      />
    </FormItem>
    <FormItem name="userId" class="enter-x">
      <Input
        v-model:value="formData.userId"
        size="large"
        :placeholder="t('sys.login.userName')"
        class="fix-auto-fill"
      />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        v-model:value="formData.password"
        size="large"
        visibility-toggle
        :placeholder="t('sys.login.password')"
        class="fix-auto-fill"
      />
    </FormItem>

    <Row class="enter-x">
      <Col :span="12">
        <FormItem>
          <!-- No logic, you need to deal with it yourself -->
          <Checkbox v-model:checked="rememberMe" size="small">
            {{ t('sys.login.rememberMe') }}
          </Checkbox>
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem :style="{ 'text-align': 'right' }">
          <!-- No logic, you need to deal with it yourself -->
          <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
            {{ t('sys.login.forgetPassword') }}
          </Button>
        </FormItem>
      </Col>
    </Row>

    <FormItem class="enter-x">
      <Button type="primary" size="large" block :loading="loading" @click="handleLogin">
        {{ t('sys.login.loginButton') }}
      </Button>
    </FormItem>
  </Form>
</template>
