import React, { memo, useEffect } from "react";
// import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { icons } from "../../utils/icons";
import {
  authSelect,
  setCredentials,
} from "../../redux/features/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { useSociallogInMutation } from "../../redux/features/apis/authApi";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";

const SocialLoginForm = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(authSelect);

  const [socialLogin] = useSociallogInMutation();

  const onSuccess = async (response) => {
    try {
      const details = jwtDecode(response.credential);
      console.log(details);
      if (!details) {
        toast.warning("Đăng nhập thất bại");
        return;
      }

      const user = {
        firstName: details.family_name,
        lastName: details.given_name,
        email: details.email,
        avatar: details.picture,
      };

      if (details.sub) user.googleId = details.sub;

      const res = await socialLogin(user);
      if (res && res.data && res.data.success) {
        dispatch(
          setCredentials({
            user: res?.data?.data,
            accessToken: res?.data?.accessToken,
            refreshToken: res?.data?.refreshToken,
          })
        );
        toast.success("Đăng nhập thành công !");
      }
    } catch (error) {}
  };

  const onFacebookSuccess = async (response) => {
    try {
      const details = response.data;
      console.log(details);
      if (!details) {
        toast.warning("Đăng nhập thất bại");
        return;
      }

      const user = {
        firstName: details.first_name,
        lastName: details.last_name,
        email: details.email,
        avatar: details.picture.data.url,
      };

      if (details.id) user.facebookId = details.id;

      const res = await socialLogin(user);
      if (res && res.data && res.data.success) {
        dispatch(
          setCredentials({
            user: res?.data?.data,
            accessToken: res?.data?.accessToken,
            refreshToken: res?.data?.refreshToken,
          })
        );
        toast.success("Đăng nhập thành công !");
      }
    } catch (error) {}
  };

  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <GoogleOAuthProvider clientId="401289267989-9mb2gnrnml6ru7gfjbjq9ete1j5h0ukm.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={onSuccess}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </GoogleOAuthProvider>

      <LoginSocialFacebook
        appId={process.env.REACT_APP_FACEBOOK_APP_ID}
        onResolve={onFacebookSuccess}
        onReject={(error) => {
          console.log(error);
        }}
      >
        <FacebookLoginButton />
      </LoginSocialFacebook>
    </div>
  );
};

export default memo(SocialLoginForm);
