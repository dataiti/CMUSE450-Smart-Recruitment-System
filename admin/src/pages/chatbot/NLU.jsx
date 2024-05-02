import { Input, Typography } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import {
  useAddIntentItemMutation,
  useDeleteExampleItemMutation,
  useGetListIntensQuery,
  useGetNLUDataQuery,
} from "../../redux/features/apis/rasas/nluApi";
import { InputSelectCustom, Search } from "../../components/chatbot";
import { icons } from "../../utils/icons";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Loading } from "../../components/shares";

const NLU = () => {
  const [exampleSearchValue, setExampleSearchValue] = useState("");
  const [exampleValue, setExampleValue] = useState("");
  const [intentValue, setIntentValue] = useState("");
  const [listNLUData, setListNLUData] = useState([]);
  const [listIntent, setListIntent] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [isAddExampleForm, setIsAddExampleForm] = useState(false);

  const { data: NLUData, isFetching } = useGetNLUDataQuery();
  const { data: listIntentData } = useGetListIntensQuery();
  const [addIntentItem, { isLoading }] = useAddIntentItemMutation();
  const [deleteExampleItem] = useDeleteExampleItemMutation();

  useEffect(() => {
    if (NLUData && NLUData.data) {
      setListNLUData(NLUData?.data);
    }
  }, [NLUData]);

  useEffect(() => {
    if (listIntentData && listIntentData.data) {
      setListIntent(listIntentData?.data);
    }
  }, [listIntentData]);

  const handleAddNewIntent = async () => {
    try {
      const res = await addIntentItem({
        data: { intentName: intentValue, exampleItem: exampleValue },
      });
      if (res && res.data) {
        setExampleValue("");
        setIntentValue("");
        setListIntent((prev) => {
          if (!prev.includes(res.data.data.intent)) {
            return [res.data.data.intent, ...prev];
          }
          return prev;
        });
        setListNLUData((prev) => [
          { example: exampleValue, intent: intentValue },
          ...prev,
        ]);
        toast.success("Thêm example thành công !");
      }
    } catch (error) {}
  };

  const handleUpdateExampleItem = async ({ exampleItem, intentName }) => {
    try {
      setIsAddExampleForm(true);
      setExampleValue(exampleItem);
      setIntentValue(intentName);
    } catch (error) {}
  };

  const handleDeleteExampleItem = async ({ exampleItem, intentName }) => {
    try {
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
          const res = await deleteExampleItem({ exampleItem, intentName });
          if (res && res.data && res.data.success) {
            setListNLUData((prev) => {
              return prev.filter(
                (intent) =>
                  intent.example !== exampleItem && intent.intent !== intentName
              );
            });
            toast.success("Xoá thành công");
          }
        }
      });
    } catch (error) {}
  };

  return (
    <div className="h-screen">
      {(isLoading || isFetching) && <Loading />}
      <div className="h-[60px] flex items-center w-full px-4 bg-white">
        <Typography className="font-bold">NLU Training Data</Typography>
      </div>
      <div className="py-7 px-16">
        <div className="relative h-[620px] w-full bg-white rounded-lg">
          <Search
            searchValue={exampleSearchValue}
            setSearchValue={setExampleSearchValue}
            setIsAddForm={setIsAddExampleForm}
            placeholder="Tìm kiếm example"
          />
          {isAddExampleForm && (
            <div className="absolute z-10 w-full p-2 grid grid-cols-4 gap-2 bg-blue-50 shadow-md">
              <div className="col-span-2">
                <Input
                  className="bg-white"
                  value={exampleValue}
                  onChange={(e) => setExampleValue(e.target.value)}
                  label="Thêm một example mới"
                  spellCheck={false}
                />
              </div>
              <div className="col-span-1 relative">
                <InputSelectCustom
                  handleAddNewIntent={handleAddNewIntent}
                  setIsFocus={setIsFocus}
                  isFocus={isFocus}
                  setValue={setIntentValue}
                  value={intentValue}
                  listItem={listIntent}
                  setListItem={setListIntent}
                  setListNLUData={setListNLUData}
                  label="Chọn hoặc tạo một intent"
                />
              </div>
              <div className="col-span-1 flex justify-end gap-2">
                <button
                  className="border-2 border-blue-gray-800 text-blue-gray-800 bg-white rounded-md px-6 py-2 text-xs font-bold hover:bg-blue-gray-100 transition-all"
                  onClick={() => setIsAddExampleForm(false)}
                >
                  Huỷ
                </button>
                <button
                  className="bg-blue-gray-800 text-white rounded-md px-6 py-2 text-xs font-bold hover:bg-blue-gray-700 transition-all"
                  onClick={handleAddNewIntent}
                >
                  Lưu
                </button>
              </div>
            </div>
          )}
          <div className="h-[calc(620px-60px)] overflow-y-auto">
            <div className="h-full w-full">
              <div>
                {listNLUData?.map((nluItem, index) => {
                  return (
                    <div
                      className="group grid grid-cols-4 hover:bg-gray-100 transition-all cursor-pointer border-b py-2 px-4"
                      key={`${nluItem.intent}-${index}`}
                    >
                      <Typography className="text-sm text-gray-700 font-bold col-span-2">
                        {nluItem.example}
                      </Typography>
                      <div className="flex justify-center">
                        <Typography className="text-center text-xs text-green-500 font-bold py-2 px-6 rounded-md bg-green-50">
                          {nluItem.intent}
                        </Typography>
                      </div>
                      <div className="flex justify-end items-center gap-2">
                        <button
                          className="hidden group-hover:inline-block text-gray-600 hover:bg-blue-gray-700 p-2 rounded-md hover:text-white"
                          onClick={() =>
                            handleUpdateExampleItem({
                              exampleItem: nluItem.example,
                              intentName: nluItem.intent,
                            })
                          }
                        >
                          <icons.FiEdit size={18} />
                        </button>
                        <button
                          className="hidden group-hover:inline-block text-gray-600 hover:bg-blue-gray-700 p-1 rounded-md hover:text-white"
                          onClick={() =>
                            handleDeleteExampleItem({
                              exampleItem: nluItem.example,
                              intentName: nluItem.intent,
                            })
                          }
                        >
                          <icons.MdDeleteForever size={26} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NLU;
