import React, { useEffect } from "react";
import { premiumPackageData } from "../../utils/constants";
import { Typography } from "@material-tailwind/react";
import { icons } from "../../utils/icons";
import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "../../redux/features/slices/titleSlice";
import { numberWithCommas } from "../../utils/fn";
import { useCreatePaymentMutation } from "../../redux/features/apis/transactionApi";
import { authSelect } from "../../redux/features/slices/authSlice";
import { Loading, ButtonCustom } from "../../components/shares";

const PaymentPage = () => {
  const dispatch = useDispatch();

  const { user } = useSelector(authSelect);

  const [createPayment, { isLoading }] = useCreatePaymentMutation();

  useEffect(() => {
    dispatch(setTitle("Mua dịch vụ"));
  }, [dispatch]);

  const handlePaymentPremiumPackage = async () => {
    try {
      const response = await createPayment({
        userId: user?._id,
        employerId: user?.ownerEmployerId?._id,
        data: {
          amount: 2000000,
          bankCode: "NCB",
          orderInfo: "Mua dịch vụ Premium",
          orderType: "billpayment",
          locale: "vn",
        },
      });

      if (response?.data?.redirectUrl) {
        window.open(response.data.redirectUrl, "_blank");
      }
    } catch (error) {}
  };

  return (
    <div className="h-full flex items-center justify-center">
      {isLoading && <Loading />}
      <div className="w-[70%] bg-white rounded-md px-10 py-5">
        <Typography className="uppercase font-bold text-light-blue-500">
          Mua dịch vụ gói Premium
        </Typography>
        <hr className="my-2 border-blue-gray-100" />
        {premiumPackageData.map((item) => {
          return (
            <div key={item.id} className="grid grid-cols-5 gap-2">
              <div className="col-span-2">
                <Typography className="flex items-center gap-2 text-blue-gray-800 font-bold">
                  <span className=" text-green-500 ">
                    <icons.BsCheckCircleFill size={24} />
                  </span>
                  {item.title}:
                </Typography>
              </div>
              <Typography className="col-span-3 text-gray-600 font-medium">
                {item.description}
              </Typography>
            </div>
          );
        })}
        <hr className="my-2 border-blue-gray-100" />
        <div className="flex items-center justify-between">
          <Typography className="font-extrabold text-3xl text-light-blue-500">
            {numberWithCommas(2000000)} VND
          </Typography>
          {user?.ownerEmployerId?.isBuyedPremium ? (
            <div className="flex items-center gap-2 bg-green-50 border border-green-500 text-green-500 px-4 py-2 rounded-md">
              <icons.BsCheckCircleFill size={20} />
              <Typography className="text-sm font-bold">
                Bạn đã năng cấng gói Premium
              </Typography>
            </div>
          ) : (
            <ButtonCustom onClick={handlePaymentPremiumPackage}>
              Mua Ngay
            </ButtonCustom>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
