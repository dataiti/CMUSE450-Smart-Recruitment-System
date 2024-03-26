import React, { useEffect, useState } from "react";
import { Input } from "@material-tailwind/react";
import jsyaml from "js-yaml";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import {
  useAddStoryMutation,
  useDeleteStoryMutation,
  useGetStoriesDataQuery,
  useGetStoryQuery,
  useUpdateStoryMutation,
} from "../../redux/features/apis/rasas/storiesApi";

import {
  ButtonCustom,
  Loading,
  TypographyCustom,
} from "../../components/shares";
import { FlowStories, Search, YamlEditor } from "../../components/chatbot";

import { swalConfig } from "../../utils/constants";
import { icons } from "../../utils/icons";

const Stories = () => {
  const [searchValue, setSearchValue] = useState("");
  const [storyValue, setStoryValue] = useState("");
  const [isAddStoryForm, setIsAddStoryForm] = useState(false);
  const [storiesValue, setStoriesValue] = useState([]);
  const [selectedStory, setSelectedStory] = useState("");
  const [storyItem, setStoryItem] = useState("");

  const { data: storiesData, isFetching } = useGetStoriesDataQuery();
  const { data: storyData, isLoading } = useGetStoryQuery(
    { storyName: selectedStory },
    { refetchOnMountOrArgChange: true, skip: !selectedStory }
  );
  const [addStory] = useAddStoryMutation();
  const [deleteStory] = useDeleteStoryMutation();
  const [updateStory] = useUpdateStoryMutation();

  // Lưu stories data vào state khi component được mount lần đầu tiên
  useEffect(() => {
    if (storiesData && storiesData.data) {
      setStoriesValue(storiesData.data);
      setSelectedStory(storiesData.data[0] && storiesData.data[0].story);
      setIsAddStoryForm(false);
    }
  }, [storiesData]);

  // Xử lý set data từ storie.yml khi component được mount
  useEffect(() => {
    try {
      if (storyData && storyData.data) {
        setIsAddStoryForm(false);
        setStoryItem(jsyaml.dump(storyData.data));
      }
    } catch (error) {
      toast.error("Sai cu phap kia");
    }
  }, [selectedStory, storyData]);

  // hàm xử lý goi API lưu story vào stories.yml
  const handleSaveStory = async () => {
    try {
      const data = jsyaml.load(storyItem);
      if (isAddStoryForm) {
        const res = await addStory({ data });
        if (res && res.data && res.data.success) {
          setStoriesValue((prev) => {
            if (!prev.find((item) => item?.story === res.data.data.story)) {
              return [...prev, res.data.data];
            }

            return prev;
          });

          toast.success("Thêm story thành công");
        }
      } else {
        const res = await updateStory({ data, storyName: selectedStory });

        if (res && res.data && res.data.success) {
          toast.success("Lưu story thành công");
        }
      }
    } catch (error) {}
  };

  // hàm xử lý goi API xoá story vào stories.yml
  const handleDeleteStory = async () => {
    try {
      const swalResult = await Swal.fire(swalConfig);

      if (swalResult.isConfirmed) {
        const res = await deleteStory({ storyName: selectedStory });
        if (res && res.data && res.data.success) {
          setStoriesValue((prev) =>
            prev.filter((item) => item.story !== selectedStory)
          );

          setSelectedStory(storiesValue[0] && storiesValue[0].story);
          setStoryItem("");
          toast.success("Xoá thành công");
        }
      }
    } catch (error) {}
  };

  const handleResetStoryForm = () => {
    setIsAddStoryForm(false);
    setSelectedStory(storiesData.data[0].story);
  };

  return (
    <div className="w-full flex flex-col bg-white">
      {(isFetching || isLoading) && <Loading />}
      <div className="h-[60px] flex w-full border-b border-blue-gray-300">
        <div className="flex items-center justify-center w-[20%] h-full border-r border-blue-gray-300">
          <TypographyCustom text="Stories" className="font-bold" />
        </div>
        <div className="w-[80%]">
          <Search
            searchValue={searchValue}
            placeholder="Tìm kiếm mẫu story"
            setSearchValue={setSearchValue}
            setIsAddForm={setIsAddStoryForm}
            setSelected={setSelectedStory}
            setItem={setStoryItem}
          />
        </div>
      </div>
      <div className="h-[calc(100vh-60px)] overflow-y-auto flex w-full">
        <div className="w-[20%] h-full border-r border-blue-gray-300">
          <ul>
            {storiesValue?.map((story, index) => {
              return (
                <li
                  key={story?.story}
                  className={`group p-4 flex items-center justify-between border-r-4 text-gray-700 cursor-pointer hover:bg-blue-gray-50 transition-all ${
                    story?.story === selectedStory
                      ? "!bg-blue-gray-100 border-blue-gray-700 text-light-blue-600"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedStory(story?.story)}
                >
                  <TypographyCustom text={story?.story} className="name" />
                  <button className="hidden group-hover:inline-block text-gray-600">
                    <icons.MdDeleteForever size={20} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="w-[80%] ">
          <div className="flex h-full ">
            <div className="flex-1 h-full border-r border-blue-gray-300">
              <div className="h-[60px] flex items-center gap-2 justify-between px-4 border-b border-blue-gray-300">
                {isAddStoryForm ? (
                  <Input
                    label="Thêm một story"
                    color="blue"
                    value={storyValue}
                    onChange={(e) => setStoryValue(e.target.value)}
                  />
                ) : (
                  <TypographyCustom
                    text={selectedStory}
                    className="text-blue-600 name"
                  />
                )}
                <div className="col-span-1 flex justify-end gap-2">
                  <ButtonCustom
                    className="border-2 border-blue-gray-800 text-blue-gray-800 "
                    onClick={handleResetStoryForm}
                    variant="outlined"
                    size="sm"
                  >
                    Huỷ
                  </ButtonCustom>
                  <ButtonCustom
                    className="bg-blue-gray-800 text-white"
                    onClick={handleSaveStory}
                    size="sm"
                  >
                    Lưu
                  </ButtonCustom>
                  <button
                    className="text-gray-600 hover:text-gray-800"
                    onClick={handleDeleteStory}
                  >
                    <icons.MdDeleteForever size={30} />
                  </button>
                </div>
              </div>
              <div className="h-[calc(100vh-120px)]">
                <YamlEditor yamlValue={storyItem} setYamlValue={setStoryItem} />
              </div>
            </div>
            <div className="flex-1 h-full">
              <div className="h-[60px] flex items-center justify-center border-b border-blue-gray-300">
                <TypographyCustom text="Luồng chạy của câu chuyện" />
              </div>
              <div className="h-[calc(100vh-120px)] overflow-y-auto">
                <FlowStories steps={jsyaml.load(storyItem)?.steps} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stories;
