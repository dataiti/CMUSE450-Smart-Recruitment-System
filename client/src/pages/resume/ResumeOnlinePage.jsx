import React, { useRef, useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import { useReactToPrint } from "react-to-print";
import { menuCVItems, sidebarItems } from "../../utils/constants";
import IconButtonCustom from "../../components/IconButtonCustom";
import { icons } from "../../utils/icons";
import { toast } from "react-toastify";

const ResumeOnlinePage = () => {
  const [sizePaper, setSizePaper] = useState();
  const [indexSidebarMenu, setIndexSidebarMenu] = useState(1);

  const conponentPDF = useRef();

  const generatePDF = useReactToPrint({
    content: () => conponentPDF.current,
    documentTitle: "Userdata",
    onAfterPrint: () => toast.success("Đã lưu !"),
  });

  return (
    <div className="h-[calc(100vh-80px)]">
      <div className="grid grid-cols-12">
        <div className="col-span-2 bg-blue-gray-800">
          <div className="w-[80px] h-full bg-blue-gray-900 ">
            <div className="flex flex-col items-stretch gap-7">
              {menuCVItems.map((item) => {
                return (
                  <div
                    className="flex flex-col gap-2 items-center"
                    key={item.id}
                    onClick={() => setIndexSidebarMenu(item.id)}
                  >
                    <IconButtonCustom className="!rounded-lg bg-white text-light-blue-600">
                      {item.icon}
                    </IconButtonCustom>
                    <Typography className="text-white text-xs font-bold">
                      {item.name}
                    </Typography>
                  </div>
                );
              })}
              <div
                className="flex flex-col gap-2 items-center"
                onClick={() => generatePDF()}
              >
                <IconButtonCustom className="!rounded-lg bg-white text-light-blue-600">
                  <icons.BsFileEarmarkArrowDownFill size={20} />
                </IconButtonCustom>
                <Typography className="text-white text-xs font-bold">
                  Tải xuống
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-7 flex justify-center h-[calc(100vh-80px)] overflow-y-auto p-12">
          <div
            className="h-[1120px] w-[692px] bg-white"
            ref={conponentPDF}
          ></div>
        </div>
        <div className="col-span-3">chat</div>
      </div>
    </div>
  );
};

export default ResumeOnlinePage;
