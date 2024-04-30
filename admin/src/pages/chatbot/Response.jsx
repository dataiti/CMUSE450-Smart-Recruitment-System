import { Input, Typography } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { InputSelectCustom, Search } from "../../components/chatbot";
import {
  useAddUtterItemMutation,
  useDeleteUtterItemMutation,
  useDeleteUtterMutation,
  useGetListUttersQuery,
  useGetUtterItemQuery,
  useUpdateUtterItemMutation,
} from "../../redux/features/apis/rasas/responseApi";
import { icons } from "../../utils/icons";
import { toast } from "react-toastify";
import { Loading } from "../../components/shares";
import { useDebounce } from "../../hooks";

const Response = () => {
  const [searchValue, setSearchValue] = useState("");
  const [utterValue, setUtterValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [responseValue, setResponseValue] = useState([]);
  const [isAddResponseForm, setIsAddResponseForm] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [selectedUtter, setSelectedUtter] = useState("");
  const [utterItem, setUtterItem] = useState({});
  const [isEditForm, setIsEditForm] = useState(false);
  const [oldText, setOldText] = useState("");

  const searchDebouceValue = useDebounce(searchValue, 500);

  const { data: listUttersData } = useGetListUttersQuery();
  const { data: utterItemData, isFetching } = useGetUtterItemQuery(
    {
      utterName: selectedUtter,
    },
    { refetchOnMountOrArgChange: true }
  );
  const [addUtterItem, { isLoading }] = useAddUtterItemMutation();
  const [deleteUtter] = useDeleteUtterMutation();
  const [deleteUtterItem] = useDeleteUtterItemMutation();
  const [updateUtterItem] = useUpdateUtterItemMutation();

  useEffect(() => {
    if (listUttersData && listUttersData.data) {
      setResponseValue(listUttersData.data);
      setSelectedUtter(listUttersData.data[0].utterName);
    }
  }, [listUttersData]);

  useEffect(() => {
    if (utterItemData && utterItemData.data) {
      setUtterItem(utterItemData.data);
    }
  }, [selectedUtter, utterItemData]);

  const handleAddNewUtterItem = async () => {
    try {
      if (isEditForm) {
        const res = await updateUtterItem({
          data: { utterName: selectedUtter, oldText, newText: textValue },
        });
        if (res && res.data && res.data.success) {
          let copiedUtterItem =
            utterItem.utterTexts !== null ? [...utterItem.utterTexts] : [];
          const findIndex = copiedUtterItem.findIndex(
            (item) => item.text === oldText
          );
          copiedUtterItem[findIndex] = { text: textValue };
          setUtterItem((prev) => ({ ...prev, utterTexts: copiedUtterItem }));
          toast.success("Cập nhật thành công");
        }
      } else {
        const res = await addUtterItem({
          data: { utterName: utterValue, textContent: textValue },
        });
        if (res && res.data && res.data.success) {
          let copiedUtterItem =
            utterItem.utterTexts !== null ? [...utterItem.utterTexts] : [];
          copiedUtterItem.push({ text: textValue });
          setUtterItem((prev) => ({ ...prev, utterTexts: copiedUtterItem }));
          setResponseValue((prev) => {
            if (
              !prev.find((item) => item?.utterName === res.data.data.utterName)
            ) {
              return [
                ...prev,
                {
                  utterName: res.data.data.utterName,
                  utterTexts: [{ text: res.data.data.textContent }],
                },
              ];
            }
            return prev;
          });
          setUtterValue("");
          setTextValue("");
          toast.success("Thêm thành công");
        }
      }
    } catch (error) {}
  };

  const handleDeleteUtterTextItem = async ({ utterName, textContent }) => {
    try {
      if (
        utterItem &&
        utterItem.utterTexts &&
        utterItem.utterTexts.length === 1
      ) {
        toast.success("Phải có ít nhất 1 utter text");
        return;
      }
      Swal.fire({
        title: "Bạn có chắc không ?",
        text: "Bạn sẽ không thể hoàn tác điều này!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0B5345 ",
        cancelButtonColor: "#A93226",
        confirmButtonText: "Vâng, xoá !",
        cancelButtonText: "Huỷ",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await deleteUtterItem({ utterName, textContent });
          if (res && res.data && res.data.success) {
            setUtterItem((prev) => ({
              ...prev,
              utterTexts: prev.utterTexts.filter(
                (item) => item.text !== res.data.data.textContent
              ),
            }));
            toast.success("Xoá thành công");
          }
        }
      });
    } catch (error) {}
  };

  const handleDeleteUtter = async ({ utterName }) => {
    try {
      const res = await deleteUtter({ utterName });
      if (res && res.data && res.data.success) {
        setResponseValue((prev) =>
          prev.filter((item) => item.utterName !== utterName)
        );
        toast.success("Xoá thành công");
      }
    } catch (error) {}
  };

  return (
    <div className="h-screen">
      {(isLoading || isFetching) && <Loading />}
      <div className="h-[60px] flex items-center w-full px-4 bg-white">
        <Typography className="font-bold">Response</Typography>
      </div>
      <div className="py-7 px-16">
        <div className="relative h-[620px] w-full bg-white rounded-lg">
          <Search
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setIsAddForm={setIsAddResponseForm}
            placeholder="Tìm kiếm mẫu response"
          />
          {isAddResponseForm && (
            <div className="absolute z-10 w-full p-2 grid grid-cols-4 gap-2 bg-blue-50 shadow-md">
              <div className="col-span-1 relative">
                <InputSelectCustom
                  // handleAddNewIntent={handleAddNewIntent}
                  setIsFocus={setIsFocus}
                  isFocus={isFocus}
                  setValue={setUtterValue}
                  value={utterValue}
                  listItem={responseValue}
                  setListItem={setResponseValue}
                  label="Tạo hoặc chọn một utter"
                  // setListNLUData={setListNLUData}
                />
              </div>
              <div className="col-span-2">
                <Input
                  className="bg-white"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  label="Thêm một response text cho mẫu này"
                  spellCheck={false}
                />
              </div>
              <div className="col-span-1 flex justify-end gap-2">
                <button
                  className="border-2 border-blue-gray-800 text-blue-gray-800 bg-white rounded-md px-6 py-2 text-xs font-bold hover:bg-blue-gray-100 transition-all"
                  onClick={() => setIsAddResponseForm(false)}
                >
                  Huỷ
                </button>
                <button
                  className="bg-blue-gray-800 text-white rounded-md px-6 py-2 text-xs font-bold hover:bg-blue-gray-700 transition-all"
                  onClick={handleAddNewUtterItem}
                >
                  Lưu
                </button>
              </div>
            </div>
          )}
          <div className="h-[calc(620px-60px)] overflow-y-auto">
            <div className="grid grid-cols-4 h-full">
              <div className="col-span-1 border-r border-blue-gray-300 h-full overflow-y-auto">
                <ul className="flex flex-col h-full overflow-y-auto">
                  {responseValue?.map((utterItem) => {
                    return (
                      <li
                        key={utterItem?.utterName}
                        className={`group p-4 flex items-center justify-between border-r-4 text-gray-700 cursor-pointer hover:bg-blue-gray-50 transition-all ${
                          utterItem?.utterName === selectedUtter
                            ? "!bg-blue-gray-100 border-blue-gray-700 text-light-blue-600"
                            : "border-transparent"
                        }`}
                        onClick={() => {
                          setIsAddResponseForm(false);
                          setTextValue("");
                          setUtterValue("");
                          setSelectedUtter(utterItem?.utterName);
                        }}
                      >
                        <Typography className="text-sm font-bold ">
                          {utterItem?.utterName}
                        </Typography>
                        <button
                          className="hidden group-hover:inline-block text-gray-600"
                          onClick={() =>
                            handleDeleteUtter({
                              utterName: utterItem?.utterName,
                            })
                          }
                        >
                          <icons.MdDeleteForever size={20} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="col-span-3 h-full">
                <ul className="flex flex-col h-full overflow-y-auto">
                  {utterItem?.utterTexts?.map((utter, index) => {
                    return (
                      <li
                        className="group flex justify-between items-center cursor-pointer hover:bg-blue-gray-50 transition-all p-4 border-b"
                        key={index}
                      >
                        <Typography className="text-sm text-gray-700 font-bold col-span-2">
                          {utter?.text}
                        </Typography>
                        <div className="flex justify-end items-center gap-2">
                          <button
                            className="hidden group-hover:inline-block text-gray-600 hover:text-gray-800"
                            //  onClick={() => handleUpdateUtterTextItem({utterName: utterItem?.utterName, oldText: utter?.text})}
                            onClick={() => {
                              setIsEditForm(true);
                              setIsAddResponseForm(true);
                              setTextValue(utter?.text);
                              setUtterValue(utterItem?.utterName);
                              setOldText(utter?.text);
                            }}
                          >
                            <icons.FiEdit size={16} />
                          </button>
                          <button
                            className="hidden group-hover:inline-block text-gray-600 hover:text-gray-800"
                            onClick={() =>
                              handleDeleteUtterTextItem({
                                utterName: utterItem?.utterName,
                                textContent: utter?.text,
                              })
                            }
                          >
                            <icons.MdDeleteForever size={20} />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Response;
