import { Input, Typography } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import {
  useAddUtterItemMutation,
  useDeleteUtterItemMutation,
  useDeleteUtterMutation,
  useGetListUttersQuery,
  useGetUtterItemQuery,
  useUpdateUtterItemMutation,
} from "../../redux/features/apis/rasas/responseApi";

import {
  HeaderChatbot,
  InputSelectCustom,
  Search,
} from "../../components/chatbot";
import {
  ButtonCustom,
  Loading,
  TypographyCustom,
} from "../../components/shares";

import { icons } from "../../utils/icons";
import { swalConfig } from "../../utils/constants";

const Response = () => {
  const [searchValue, setSearchValue] = useState("");
  const [utterValue, setUtterValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [responseValue, setResponseValue] = useState([]);
  const [isAddResponseForm, setIsAddResponseForm] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [selectedUtter, setSelectedUtter] = useState(null);
  const [utterItem, setUtterItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [oldText, setOldText] = useState("");

  const { data: listUttersData } = useGetListUttersQuery();
  const { data: utterItemData, isFetching } = useGetUtterItemQuery(
    {
      utterName: selectedUtter,
    },
    { refetchOnMountOrArgChange: true, skip: !selectedUtter }
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

  // Hàm xử lý gọi API tạo mới hoặc cập nhật một utter trong domain.yml
  const handleCreateOrUpdateUtter = async () => {
    try {
      // Nếu state là isEditing thì gọi API cập nhật và ngược lại thì tạo mới
      if (isEditing) {
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

  // Hàm xử lý gọi API xoá một utter_text trong domain.yml
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

      const swalResult = await Swal.fire(swalConfig);

      if (swalResult.isConfirmed) {
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
    } catch (error) {}
  };

  // Hàm xử lý gọi API xoá một utter trong domain.yml
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

  const handleSelectUtter = ({ utterItem }) => {
    setIsAddResponseForm(false);
    setTextValue("");
    setUtterValue("");
    setSelectedUtter(utterItem?.utterName);
  };

  const handleClickUtterItem = ({ utter = {} }) => {
    setIsEditing(true);
    setIsAddResponseForm(true);
    setTextValue(utter?.text);
    setUtterValue(utterItem?.utterName);
    setOldText(utter?.text);
  };

  return (
    <div className="h-screen">
      {(isLoading || isFetching) && <Loading />}
      <HeaderChatbot title="Response" />
      <div className="py-7 px-16">
        <div className="relative h-[620px] w-full bg-white rounded-lg">
          <Search
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setIsAddForm={setIsAddResponseForm}
            setIsEditForm={setIsEditing}
            setItem={setUtterItem}
            setSelected={setSelectedUtter}
            setTextValue={setTextValue}
            setUtterValue={setUtterValue}
            placeholder="Tìm kiếm mẫu response"
          />
          {isAddResponseForm && (
            <div className="absolute z-10 w-full p-2 grid grid-cols-4 gap-2 bg-blue-50 shadow-md">
              <div className="col-span-1 relative">
                <InputSelectCustom
                  setIsFocus={setIsFocus}
                  isFocus={isFocus}
                  setValue={setUtterValue}
                  value={utterValue}
                  listItem={responseValue}
                  setListItem={setResponseValue}
                  label="Tạo hoặc chọn một utter"
                />
              </div>
              <div className="col-span-2">
                <Input
                  className="bg-white"
                  color="blue"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  label="Thêm một response text cho mẫu này"
                  spellCheck={false}
                />
              </div>
              <div className="col-span-1 flex justify-end gap-2">
                <ButtonCustom
                  className="border-2 border-blue-gray-800 text-blue-gray-800 bg-white rounded-md px-6 py-2 text-xs font-bold hover:bg-blue-gray-100 transition-all"
                  onClick={() => setIsAddResponseForm(false)}
                >
                  Huỷ
                </ButtonCustom>
                <ButtonCustom
                  className="bg-blue-gray-800 text-white rounded-md px-6 py-2 text-xs font-bold hover:bg-blue-gray-700 transition-all"
                  onClick={handleCreateOrUpdateUtter}
                >
                  Lưu
                </ButtonCustom>
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
                        onClick={() => handleSelectUtter({ utterItem })}
                      >
                        <TypographyCustom text={utterItem?.utterName} />
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
                        <TypographyCustom
                          text={utter?.text}
                          className="col-span-2"
                        />
                        <div className="flex justify-end items-center gap-2">
                          <button
                            className="hidden group-hover:inline-block text-gray-600 hover:text-gray-800"
                            onClick={() => handleClickUtterItem({ utter })}
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
