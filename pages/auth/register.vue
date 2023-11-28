<script setup lang="ts">
// 搜索引擎优化
useSeoMeta({
  // 该页面的标题
  title: "注册",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "注册",
  // 该页面的描述
  description: "同日 MES 系统，注册",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，注册",
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
    x: -100,
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

// 姓名
let name = ref<string>("");
// 手机号
let tel = ref<string>("");
// 邮箱
let email = ref<string>("");
// 密码
let password = ref<string>("");
// 是否显示密码
let showPassword = ref<boolean>(false);
// 验证码
let captcha = ref<string>("");
// 手机号登陆的表单校验
let registerFormValid = ref<boolean>(false);

// 姓名校验规则
const nameRule = ref<any[]>([
  (v: any) => !!v || "姓名不能为空",
  (v: any) => v.length < 16 || "姓名长度过长",
]);

// 手机号校验规则
const telRule = ref<any[]>([
  (v: any) => !!v || "手机号不能为空",
  (v: any) =>
    /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(v) || "请输入满足规则的手机号",
]);

// 邮箱校验规则
const emailRule = ref<any[]>([
  (v: any) => !!v || "邮箱不能为空",

  (v: any) =>
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      v
    ) || "邮箱不合法",
]);

// 密码校验规则
const passwordRule = ref<any[]>([
  (v: any) => !!v || "密码不能为空",
  (v: any) => /^[a-zA-Z0-9]*$/.test(v) || "密码只能包含数字和字母",
  (v: any) => (v && v.length <= 20) || "密码长度不能超过20位",
]);

// 获取验证码
async function getCaptcha() {
  // 表单校验不成功则直接返回
  if (!registerFormValid.value)
    return setSnackbar("black", "请先完成表单，再点击获取验证码");

  // 验证码倒计时
  setCountDown(300);

  // 发送获取验证码请求
  const data: any = await useHttp("/Account/A02GenerateSMSCode", "post", {
    phone: tel.value,
    platform: "sit occaecat",
    template: "1890788",
    platform_version: "magna Excepteur",
  });

  if (data.code === 404)
    return setSnackbar("black", "同一账号五分钟内请勿重复发送短信");
}

// 注册
async function registerSubmit() {
  // 如果注册表单校验失败，则直接返回
  if (!registerFormValid.value) return;

  // 密码加密
  const md5Password = useMd5(password.value);

  // 发送注册请求
  const data: any = await useHttp("/Account/A05UserRegister", "post", {
    user_name: name.value,
    phone_num: tel.value,
    email_address: email.value,
    verify_code: captcha.value,
    platform: "PC",
    password: md5Password,
  });

  // 如果账号已存在
  if (data.code === 1005) return setSnackbar("black", "验证码错误");

  // 储存 Cookie
  useCookie("tel").value = tel.value;
  useCookie("password").value = password.value;
  useCookie("name").value = data.user_name;
  useCookie("token").value = data.token;
  useCookie("refreshToken").value = data.refresh_token;

  // 注册成功
  setSnackbar("green", "注册成功，正在跳转...");

  setTimeout(function () {
    router.push({ path: "/auth/login" });
  }, 1500);
}

// 函数防抖
const debounceRegisterSubmit = useDebounce(registerSubmit, 1000);
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
        <img src="/注册背景图.svg" class="w-75 h-75" />
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
          <v-card-title class="text-center text-blue text-h5"
            >注册新账号</v-card-title
          >
          <v-card-text>
            <v-form v-model="registerFormValid" class="mt-6">
              <v-text-field
                color="blue"
                density="comfortable"
                variant="outlined"
                label="姓名"
                :rules="nameRule"
                v-model="name"
              ></v-text-field>

              <v-text-field
                class="mt-3"
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
                label="邮箱"
                :rules="emailRule"
                v-model="email"
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

              <v-btn
                class="mt-3"
                color="blue"
                size="large"
                rounded="lg"
                block
                @click="debounceRegisterSubmit()"
              >
                注册
              </v-btn>
            </v-form>
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
