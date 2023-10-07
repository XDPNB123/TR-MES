export default function useCaptchaCountDown() {
  // 验证码倒计时
  let captchaCountDown = ref<string | number>("获取验证码");
  // 验证码按钮是否禁用
  let captchaDisable = ref<boolean>(false);
  // 倒计时
  function setCountDown(second: number) {
    captchaCountDown.value = second;
    captchaDisable.value = true;
    const intervalId = setInterval(function () {
      if (typeof captchaCountDown.value === "number") captchaCountDown.value--;

      if (captchaCountDown.value === 0) {
        clearInterval(intervalId);
        captchaDisable.value = false;
        captchaCountDown.value = "获取验证码";
      }
    }, 1000);
  }

  return { captchaCountDown, captchaDisable, setCountDown };
}
