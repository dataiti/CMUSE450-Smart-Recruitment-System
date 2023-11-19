import React, { useRef, useState } from "react";
import { Typography } from "@material-tailwind/react";
import { useReactToPrint } from "react-to-print";
import { menuCVItems } from "../../utils/constants";
import IconButtonCustom from "../../components/IconButtonCustom";
import { icons } from "../../utils/icons";
import { toast } from "react-toastify";
import { images } from "../../assets/images";
import { Link } from "react-router-dom";

const ResumeOnlinePage = () => {
  const [sizePaperPercent, setSizePaperPercent] = useState(100);
  const [contentMenu, setContentMenu] = useState(
    () => images.listCVTemplateImage
  );
  const [typeMenu, setTypeMenu] = useState("template");

  const conponentPDF = useRef();

  const handleSetContentMenu = (type) => {
    if (type === "template") {
      setTypeMenu(type);
      setContentMenu(images.listCVTemplateImage);
    }
  };

  const generatePDF = useReactToPrint({
    content: () => conponentPDF.current,
    documentTitle: "Userdata",
    onAfterPrint: () => toast.success("Đã lưu !"),
  });

  return (
    <div className="h-screen bg-gradient-to-r from-[#cbd5e1] to-[#f1f5f9]">
      <div className="flex h-full">
        <div className="w-[80px] h-full bg-blue-gray-900 ">
          <div className="flex flex-col items-center gap-7 py-5">
            <Link to="/">
              <img
                className="h-14 w-14 rounded-lg object-cover"
                src={images.logo}
                alt=""
              />
            </Link>
            {menuCVItems.map((item) => {
              return (
                <div
                  className="flex flex-col gap-2 items-center"
                  key={item.id}
                  onClick={() => handleSetContentMenu(item.type)}
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
        <div className="w-[15%] bg-blue-gray-800">
          {typeMenu === "template" ? (
            <div className="flex flex-col gap-3 px-5 py-10">
              {contentMenu.map((content, index) => {
                return (
                  <div key={index} className="rounded-md shadow-lg">
                    <img
                      src={content}
                      alt=""
                      className="rounded-md cursor-pointer hover:border-2 border-teal-700 transition-all"
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="w-[55%] h-screen flex justify-center overflow-y-auto p-12">
          <div className="h-[1120px] w-[692px] bg-white" ref={conponentPDF}>
            {/* <div
              className={`bg-white h-[${sizePaperPercent}%] w-[${sizePaperPercent}%]`}
            ></div> */}
          </div>
        </div>
        <div className="w-[30%] bg-[#1e293b] py-10 px-4 flex flex-col gap-5">
          <Typography className="uppercase font-bold text-white">
            Chat bot
          </Typography>
          <div className="bg-black h-full w-full rounded-md"></div>
          <input
            className="outline-none border-none px-4 py-3 rounded-full bg-blue-gray-800"
            value=""
            placeholder="Nhập câu hỏi "
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeOnlinePage;
