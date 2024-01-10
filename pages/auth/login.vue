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
  useCookie("token").value = null;
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

// 手机号校验规则
const telRule = ref<any[]>([(v: any) => !!v || "不能为空"]);

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
  const data: any = await useHttp("/auth/local", "post", {
    identifier: tel.value,
    password: md5Password,
  });

  useCookie("token").value = data.jwt;
  // useCookie("refreshToken").value = data.refresh_token;

  // 登陆成功的提示
  const data2: any = await useHttp("/wms-permissions", "get");
  const menuList: any = [];
  data2.data.forEach((item: any) => {
    menuList.push({
      icon: item.attributes.icon_name,
      id: item.id,
      name: item.attributes.permission_title,
      path: item.attributes.page_url,
      pid: item.attributes.parent_id,
      sort_node: item.attributes.sort_node,
      show: true,
    });
  });
  menuList.sort((a: any, b: any) => a.sort_node - b.sort_node);
  useCookieSplit("menuList", 5, menuList);
  // useCookieSplit("btnList", 10, data.data.btnList);
  setSnackbar("green", "登陆成功，正在跳转...");

  setTimeout(function () {
    router.push({ path: "/home" });
  }, 1000);
}

// 函数防抖，防止连续点击登陆按钮时，多次调用后台接口，提升性能
const debouncePasswordLogin = useDebounce(passwordLogin, 1000);
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
          <v-card-text>
            <v-form v-model="passwordFormValid" class="mt-6">
              <div class="text-h5 mb-6 text-blue text-center">登陆</div>
              <v-text-field
                color="blue"
                density="comfortable"
                variant="outlined"
                label="账号"
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
                <div @click="router.push({ path: '/auth/forget-password' })">
                  忘记密码
                </div>
              </div>
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
