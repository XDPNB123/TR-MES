<script setup lang="ts">
// 搜索引擎优化
useSeoMeta({
  // 该页面的标题
  title: "修改密码",
  // 社交媒体分享该页面时显示的标题
  ogTitle: "修改密码",
  // 该页面的描述
  description: "同日 MES 系统，修改密码",
  // 社交媒体分享该页面时显示的描述
  ogDescription: "同日 MES 系统，修改密码",
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

// 旧密码
let oldPassword = ref<string>("");
// 新密码
let newPassword = ref<string>("");
// 是否显示密码
let showPassword = ref<boolean>(false);
// 忘记密码的表单校验
let updatePasswordFormValid = ref<boolean>(false);

// 密码校验规则
const passwordRule = ref<any[]>([
  (v: any) => !!v || "密码不能为空",
  (v: any) => /^[a-zA-Z0-9]*$/.test(v) || "密码只能包含数字和字母",
  (v: any) => (v && v.length <= 20) || "密码长度不能超过20位",
]);

// 修改密码
async function updatePasswordSubmit() {
  if (!updatePasswordFormValid.value) return;

  // 密码加密
  const md5OldPassword = useMd5(oldPassword.value);
  const md5NewPassword = useMd5(newPassword.value);

  // 发送忘记密码的请求
  const data: any = await useHttp("/Account/A07ChangePassword", "put", {
    old_passwd_md5: md5OldPassword,
    new_passwd_md5: md5NewPassword,
  });

  // 处理错误
  if (data.code === 500) return setSnackbar("black", "修改失败，旧密码错误");

  // 储存 Cookie
  useCookie("password").value = newPassword.value;
  useCookie("token").value = data.token;
  useCookie("refreshToken").value = data.refresh_token;

  // 修改密码成功
  setSnackbar("green", "修改密码成功");

  setTimeout(function () {
    router.push({ path: "/home" });
  }, 1500);
}

// 函数防抖
const debounceUpdatePasswordSubmit = useDebounce(updatePasswordSubmit, 1000);
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
            >修改密码</v-card-title
          >
          <v-card-text>
            <v-form v-model="updatePasswordFormValid" class="mt-6">
              <v-text-field
                class="mt-3"
                color="blue"
                density="comfortable"
                variant="outlined"
                label="旧密码"
                :append-inner-icon="
                  showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'
                "
                :type="showPassword ? 'text' : 'password'"
                @click:append-inner="showPassword = !showPassword"
                :rules="passwordRule"
                v-model="oldPassword"
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

              <v-btn
                class="mt-3"
                color="blue"
                size="large"
                rounded="lg"
                block
                @click="debounceUpdatePasswordSubmit()"
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
        <img src="/修改密码背景图.svg" class="w-75 h-75" />
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
