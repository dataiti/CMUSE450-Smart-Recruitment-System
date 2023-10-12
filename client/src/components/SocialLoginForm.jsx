import React, { memo, useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { icons } from "../utils/icons";
import { gapi } from "gapi-script";
import { authSelect, setCredentials } from "../redux/features/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { useSociallogInMutation } from "../redux/features/apis/authApi";

const SocialLoginForm = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(authSelect);

  const [socialLogin] = useSociallogInMutation();

  const onSuccess = async (response) => {
    try {
      if (!response.profileObj && !response.accessToken) {
        return;
      }

      const data = response.profileObj || response;
      const user = {
        displayName: data.name || `${data.familyName} ${data.givenName}`,
        email: data.email,
        avatar: data.imageUrl,
      };

      if (data.googleId) user.googleId = data.googleId;
      if (data.userID) user.facebookId = data.userID;

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

  const onFailure = (res) => {};

  const onRequest = () => {};

  useEffect(() => {
    const start = () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: "profile",
      });
    };
    gapi.load("client:auth2", start);
  }, []);

  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        buttonText="Tiếp tục với Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        onRequest={onRequest}
        cookiePolicy={"single_host_origin"}
        className="w-full  !text-xs !rounded-full overflow-hidden flex items-center justify-center"
      />
      <FacebookLogin
        appId={process.env.REACT_APP_FACEBOOK_APP_ID}
        autoLoad
        buttonText="Log in with Google"
        fields="name,email,picture"
        callback={onSuccess}
        render={(renderProps) => (
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-full bg-blue-700 shadow-md w-full py-[9px]"
            onClick={renderProps.onClick}
          >
            <span className="text-white">
              <icons.BsFacebook size={24} />
            </span>
            <span className="text-sm text-white font-semibold">
              Tiếp tục với Facebook
            </span>
          </button>
        )}
      />
    </div>
  );
};

export default memo(SocialLoginForm);
