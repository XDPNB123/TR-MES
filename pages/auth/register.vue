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
  //
  useCookie("token").value = null;
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
let captcha = ref<boolean>(false);
// 手机号登陆的表单校验
let registerFormValid = ref<boolean>(false);

// 姓名校验规则
const nameRule = ref<any[]>([
  (v: any) => !!v || "姓名不能为空",
  (v: any) => v.length < 16 || "姓名长度过长",
]);

// 邮箱校验规则
const emailRule = ref<any[]>([
  (v: string) => !!v || "邮箱不能为空",
  (v: string) => /.+@.+\..+/.test(v) || "请输入有效的邮箱地址",
]);

// 密码校验规则
const passwordRule = ref<any[]>([
  (v: any) => !!v || "密码不能为空",
  (v: any) => /^[a-zA-Z0-9]*$/.test(v) || "密码只能包含数字和字母",
  (v: any) => (v && v.length <= 20) || "密码长度不能超过20位",
]);

// 注册
async function registerSubmit() {
  // 如果验证码校验失败，则直接返回
  if (!captcha.value) return setSnackbar("black", "请先完成验证码校验");

  // 如果注册表单校验失败，则直接返回
  if (!registerFormValid.value) return;

  // 密码加密
  const md5Password = useMd5(password.value);

  // 发送注册请求
  const data: any = await useHttp("/auth/local/register", "post", {
    email: tel.value,
    password: md5Password,
    username: name.value,
  });

  // 储存 Cookie
  useCookie("tel").value = tel.value;
  useCookie("password").value = password.value;
  useCookie("name").value = data.user_name;
  // 注册成功
  setSnackbar("green", "注册成功，正在跳转...");

  setTimeout(function () {
    router.push({ path: "/auth/login" });
  }, 1500);
}

// 函数防抖
const debounceRegisterSubmit = useDebounce(registerSubmit, 1000);

const isShowSelf = ref(true);
const width = 300;
const height = 180;
const imgUrl = "/头像.jpg"; // 这里应该是你的图片地址
const sText = "向右滑动";
const eText = "验证通过";
const isBorder = true;
const isCloseBtn = true;
const isReloadBtn = true;
const isParentNode = false;
const isShowTip = true;

function emitChange(type: string) {
  console.log(type);
  // 根据type的不同，你可以处理不同的事件，例如验证成功或失败
}
function succesChange() {
  captcha.value = true;
  isShowSelf.value = false;
  setSnackbar("green", "验证通过");
}
function failChange() {
  setSnackbar("black", "验证失败");
}
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
                label="邮箱"
                :rules="emailRule"
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
              <slider-verify
                v-model:is-show-self="isShowSelf"
                :width="width"
                :height="height"
                :img-url="imgUrl"
                :s-text="sText"
                :e-text="eText"
                :is-border="isBorder"
                :is-close-btn="isCloseBtn"
                :is-reload-btn="isReloadBtn"
                :is-parent-node="isParentNode"
                :is-show-tip="isShowTip"
                @reload="emitChange('reload')"
                @show="emitChange('show')"
                @hide="emitChange('hide')"
                @close="emitChange('close')"
                @success="succesChange"
                @fail="failChange"
              ></slider-verify>
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
