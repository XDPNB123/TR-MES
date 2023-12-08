<script setup lang="ts">
// 搜索引擎优化
useSeoMeta({
  // 该页面的标题
  title: "登陆",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "登陆",
  // 该页面的描述
  description: "同日数字化工厂系统，登陆",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日数字化工厂系统，登陆",
  // 社交媒体分享该页面时显示的图片
  ogImage: "/同日图标.png",
});
// 不采用布局
definePageMeta({
  layout: false,
});
onMounted(() => {
  // 页面初始动画
  useGsap.from(".initial-animation", {
    y: 100,
    opacity: 0,
    duration: 1,
  });
});

// 获取路由对象
const router = useRouter();
// 获取消息条对象
const { snackbarShow, snackbarColor, snackbarText, setSnackbar } =
  useSnackbar();
// 获取验证码倒计时对象
const { captchaCountDown, captchaDisable, setCountDown } =
  useCaptchaCountDown();

// 页面渲染完成时，获取 Cookie，填充登陆输入框
// useCookie 会自动转换类型，如果 cookie 中储存的是数字，那么 useCookie.value 获取的值也是数字类型，需要手动转换成字符串类型
onMounted(function () {
  tel.value = useCookie("tel").value?.toString();
  password.value = useCookie("password").value?.toString();
});

// 正在选择的登陆 tab
let tab = ref<any>(null);

// 手机号
let tel = ref<string | undefined>("");
// 密码
let password = ref<string | undefined>("");
// 是否显示密码
let showPassword = ref<boolean>(false);
// 密码登陆的表单校验
let passwordFormValid = ref<boolean>(false);

// 验证码
let captcha = ref<string>("");
// 手机号登陆的表单校验
let captchaFormValid = ref<boolean>(false);

// 下拉框选中时的返回结果（需要设置选中项）
let selectedCompany = ref<any>({
  companyName: "同日自动化",
  companyCode: "001",
});
// 下拉框绑定的所有公司帐套
let allCompany = ref<any>([{ companyName: "同日自动化", companyCode: "001" }]);

// 手机号校验规则
const telRule = ref<any[]>([
  (v: any) => !!v || "手机号不能为空",
  (v: any) =>
    /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(v) || "请输入满足规则的手机号",
]);

// 密码校验规则
const passwordRule = ref<any[]>([
  (v: any) => !!v || "密码不能为空",
  (v: string) => /^[a-zA-Z0-9]*$/.test(v) || "密码只能包含数字和字母",
  (v: string | any[]) => (v && v.length <= 20) || "密码长度不能超过20位",
]);

// 密码登陆
async function passwordLogin() {
  // 表单校验不成功则直接返回
  if (!passwordFormValid.value) return;

  // 密码加密
  const md5Password = useMd5(password.value as string);

  // 发送登陆请求
  const data: any = await useHttp("/Account/A01LoginV1", "post", {
    login_name: tel.value,
    password_md5: md5Password,
    platform: "PC",
    select_company_id: "000",
    platform_version: "网页1.00",
  });

  // 登陆失败出现提示，并则直接返回;
  if (data.code === 201) return setSnackbar("black", "账号不存在或密码错误");

  // 登陆成功，则储存 Cookie
  console.log(data.data.menuList.length);
  useCookie("tel").value = tel.value;
  useCookie("password").value = password.value;
  useCookie("name").value = data.data.userClaims.name;
  useCookie("token").value = data.token;
  useCookie("refreshToken").value = data.refresh_token;
  useCookieSplit("menuList", 5, data.data.menuList);
  useCookieSplit("btnList", 10, data.data.btnList);
  // 登陆成功的提示
  setSnackbar("green", "登陆成功，正在跳转...");

  setTimeout(function () {
    router.push({ path: "/home" });
  }, 1000);
}

// 获取验证码
async function getCaptcha() {
  // 表单校验不成功则直接返回
  if (!captchaFormValid.value)
    return setSnackbar("black", "请确认手机号无误，再点击获取验证码");

  // 验证码倒计时
  setCountDown(300);

  // 发送获取验证码请求
  const data: any = await useHttp("/Account/A02GenerateSMSCode", "post", {
    phone: tel.value,
    platform: "PC",
    template: "1890788",
    platform_version: "magna Excepteur",
  });

  if (data.code === 404)
    setSnackbar("black", "同一账号五分钟内请勿重复发送短信");
}

// 验证码登陆
async function captchaLogin() {
  // 表单校验不成功则直接返回
  if (!captchaFormValid.value) return;

  // 发送登陆请求
  const data: any = await useHttp("/Account/A03SignInSms", "post", {
    login_name: tel.value,
    platform: "PC",
    sns_code: captcha.value,
    select_company_id: "96",
    platform_version: "magna consectetur",
  });

  // 登陆失败则直接返回
  if (data.code !== 200) return setSnackbar("black", "验证码错误");

  // 登陆成功，则储存 Cookie
  useCookie("tel").value = tel.value;
  useCookie("password").value = password.value;
  useCookie("name").value = data.data.name;
  useCookie("token").value = data.token;
  useCookie("refreshToken").value = data.refresh_token;
  useCookieSplit("menuList", 5, data.data.menuList);
  useCookieSplit("btnList", 10, data.data.btnList);

  // 登陆成功提示
  setSnackbar("green", "登陆成功，正在跳转...");

  setTimeout(function () {
    router.push({ path: "/home" });
  }, 1000);
}

// 函数防抖，防止连续点击登陆按钮时，多次调用后台接口，提升性能
const debouncePasswordLogin = useDebounce(passwordLogin, 1000);
const debounceCaptchaLogin = useDebounce(captchaLogin, 1000);
</script>

<template>
  <v-app>
    <v-row no-gutters class="h-screen initial-animation">
      <v-col
        lg="6"
        xl="8"
        xxl="8"
        class="img-bg d-flex justify-center align-center"
        v-if="$vuetify.display.lgAndUp"
      >
        <img src="/登陆背景图.svg" class="w-75 h-75" />
      </v-col>

      <v-col
        cols="12"
        md="6"
        offset-md="3"
        lg="6"
        offset-lg="0"
        xl="4"
        xxl="4"
        align-self="center"
      >
        <v-card flat max-width="560" min-width="400" class="mx-auto">
          <v-tabs v-model="tab" color="blue" align-tabs="center">
            <v-tab class="text-h6" value="密码登陆">密码登陆</v-tab>
            <v-tab class="text-h6" value="验证码登陆">验证码登陆</v-tab>
          </v-tabs>

          <v-card-text>
            <v-window v-model="tab">
              <v-window-item value="密码登陆">
                <v-form v-model="passwordFormValid" class="mt-6">
                  <v-text-field
                    color="blue"
                    density="comfortable"
                    variant="outlined"
                    label="手机号"
                    :rules="telRule"
                    v-model="tel"
                  ></v-text-field>

                  <v-text-field
                    class="mt-3"
                    color="blue"
                    density="comfortable"
                    variant="outlined"
                    label="密码"
                    :append-inner-icon="
                      showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'
                    "
                    :type="showPassword ? 'text' : 'password'"
                    @click:append-inner="showPassword = !showPassword"
                    :rules="passwordRule"
                    v-model="password"
                  ></v-text-field>

                  <v-select
                    class="mt-3"
                    color="blue"
                    density="comfortable"
                    variant="outlined"
                    label="帐套"
                    return-object
                    item-title="companyName"
                    item-value="companyCode"
                    :items="allCompany"
                    v-model="selectedCompany"
                  ></v-select>

                  <v-btn
                    class="mt-3"
                    color="blue"
                    size="large"
                    rounded="lg"
                    block
                    @click="debouncePasswordLogin()"
                  >
                    登陆
                  </v-btn>

                  <div
                    class="d-flex justify-space-between mt-6 font-weight-medium text-subtitle-1 text-grey"
                  >
                    <div @click="router.push({ path: '/auth/register' })">
                      没有账号？去注册
                    </div>
                    <div
                      @click="router.push({ path: '/auth/forget-password' })"
                    >
                      忘记密码
                    </div>
                  </div>
                </v-form>
              </v-window-item>

              <v-window-item value="验证码登陆">
                <v-form v-model="captchaFormValid" class="mt-6">
                  <v-text-field
                    color="blue"
                    density="comfortable"
                    variant="outlined"
                    label="手机号"
                    :rules="telRule"
                    v-model="tel"
                  ></v-text-field>

                  <v-text-field
                    class="mt-3"
                    color="blue"
                    density="comfortable"
                    variant="outlined"
                    label="验证码"
                    v-model="captcha"
                  >
                    <template v-slot:append-inner>
                      <v-btn
                        variant="text"
                        @click="getCaptcha()"
                        :disabled="captchaDisable"
                      >
                        {{ captchaCountDown }}
                      </v-btn>
                    </template>
                  </v-text-field>

                  <v-select
                    class="mt-3"
                    color="blue"
                    density="comfortable"
                    variant="outlined"
                    label="帐套"
                    return-object
                    item-title="companyName"
                    item-value="companyCode"
                    :items="allCompany"
                    v-model="selectedCompany"
                  ></v-select>

                  <v-btn
                    class="mt-3"
                    color="blue"
                    size="large"
                    rounded="lg"
                    block
                    @click="debounceCaptchaLogin()"
                  >
                    登陆
                  </v-btn>
                </v-form>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar location="top" v-model="snackbarShow" :color="snackbarColor">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn variant="tonal" @click="snackbarShow = false">关闭</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<style scoped>
.img-bg {
  background-image: linear-gradient(25deg, #7e2df5, #7b73f6, #68a7f6, #27d9f5);
}
</style>
