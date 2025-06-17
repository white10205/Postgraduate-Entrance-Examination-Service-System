import mask from '@/hooks/useMask'

export const isLogin = () => {
  const userfInfo = localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo");
  if(!userfInfo){
    ElMessage.warning('请先登录');
    mask.showMask('login-mask');
  }
  return !!userfInfo;
};
