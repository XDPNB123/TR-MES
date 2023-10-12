<script setup lang="ts">
// 搜索引擎优化
useSeoMeta({
  // 该页面的标题
  title: "忘记密码",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "忘记密码",
  // 该页面的描述
  description: "同日 MES 系统，忘记密码",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，忘记密码",
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
    x: 100,
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

// 手机号
let tel = ref<string>("");
// 新密码
let newPassword = ref<string>("");
// 是否显示密码
let showPassword = ref<boolean>(false);
// 验证码
let captcha = ref<string>("");
// 忘记密码的表单校验
let forgetPasswordFormValid = ref<boolean>(false);

// 手机号校验规则
const telRule = ref<any[]>([
  (v: any) => !!v || "手机号不能为空",
  (v: any) =>
    /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(v) || "请输入满足规则的手机号",
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
  if (!forgetPasswordFormValid.value)
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
    setSnackbar("black", "同一账号五分钟内请勿重复发送短信");
}

// 忘记密码提交表单
async function forgetPasswordSubmit() {
  // 表单校验不成功则直接返回
  if (!forgetPasswordFormValid.value) return;

  // 密码加密
  const md5NewPassword = useMd5(newPassword.value);

  // 发送忘记密码的请求
  const data: any = await useHttp("/Account/A08RetrievePassword", "post", {
    login_name: tel.value,
    sns_code: captcha.value,
    new_password_md5: md5NewPassword,
  });

  // 处理错误
  if (data.code !== 200) return setSnackbar("black", "验证码错误");

  // 修改成功，则储存 Cookie
  useCookie("tel").value = tel.value;
  useCookie("password").value = newPassword.value;

  // 成功找回密码提示
  setSnackbar("green", "修改密码成功");

  setTimeout(function () {
    router.push({ path: "/auth/login" });
  }, 1500);
}

// 函数防抖
const debounceForgetPasswordSubmit = useDebounce(forgetPasswordSubmit, 1000);
</script>

<template>
  <v-app>
    <v-row no-gutters class="h-screen initial-animation">
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
            >忘记密码</v-card-title
          >
          <v-card-text>
            <v-form v-model="forgetPasswordFormValid" class="mt-6">
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
                label="新密码"
                :append-inner-icon="
                  showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'
                "
                :type="showPassword ? 'text' : 'password'"
                @click:append-inner="showPassword = !showPassword"
                :rules="passwordRule"
                v-model="newPassword"
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
                @click="debounceForgetPasswordSubmit()"
              >
                确认修改
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col
        lg="6"
        xl="8"
        xxl="8"
        class="img-bg d-flex justify-center align-center"
        v-if="$vuetify.display.lgAndUp"
      >
        <img src="/忘记密码背景图.svg" class="w-75 h-75" />
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
