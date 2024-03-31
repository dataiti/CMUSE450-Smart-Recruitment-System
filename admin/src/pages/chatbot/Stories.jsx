import React, { useEffect, useState } from "react";
import { FlowStories, Search, YamlEditor } from "../../components/chatbot";
import {
  useAddStoryMutation,
  useDeleteStoryMutation,
  useGetStoriesDataQuery,
  useGetStoryQuery,
  useUpdateStoryMutation,
} from "../../redux/features/apis/rasas/storiesApi";
import jsyaml from "js-yaml";
import { toast } from "react-toastify";
import { Input, Typography } from "@material-tailwind/react";
import { icons } from "../../utils/icons";
import { Loading } from "../../components/shares";
import Swal from "sweetalert2";

const Stories = () => {
  const [searchValue, setSearchValue] = useState("");
  const [storyValue, setStoryValue] = useState("");
  const [isAddStoryForm, setIsAddStoryForm] = useState(false);
  const [storiesValue, setStoriesValue] = useState([]);
  const [selectedStory, setSelectedStory] = useState("");
  const [storyItem, setStoryItem] = useState("");

  const { data: storiesData, isFetching } = useGetStoriesDataQuery({});
  const { data: storyData, isLoading } = useGetStoryQuery(
    { storyName: selectedStory },
    { refetchOnMountOrArgChange: true }
  );
  const [addStory] = useAddStoryMutation();
  const [deleteStory] = useDeleteStoryMutation();
  const [updateStory] = useUpdateStoryMutation();

  useEffect(() => {
    if (storiesData && storiesData.data) {
      setStoriesValue(storiesData.data);
      setSelectedStory(storiesData.data[0] && storiesData.data[0].story);
      setIsAddStoryForm(false);
    }
  }, [storiesData]);

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

  const handleChange = (newValue) => {
    try {
      jsyaml.load(newValue);
      setStoryItem(newValue);
    } catch (error) {
      console.error("YAML Error:", error.message);
      toast.error("Sai cu phap kia");
    }
  };

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

  const handleDeleteStory = async () => {
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
      });
    } catch (error) {}
  };

  return (
    <div className="w-full flex flex-col bg-white">
      {(isFetching || isLoading) && <Loading />}
      <div className="h-[60px] flex w-full border-b border-blue-gray-300">
        <div className="flex items-center justify-center w-[20%] h-full border-r border-blue-gray-300">
          <Typography className="font-bold">Stories</Typography>
        </div>
        <div className="w-[80%]">
          <Search
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setIsAddForm={setIsAddStoryForm}
            placeholder="Tìm kiếm mẫu story"
            setSelected={setSelectedStory}
            setItem={setStoryItem}
          />
        </div>
      </div>
      <div className="h-[calc(100vh-60px)] flex w-full">
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
                  <Typography className="text-sm font-bold ">
                    {story?.story}
                  </Typography>
                  <button
                    className="hidden group-hover:inline-block text-gray-600"
                    // onClick={() =>
                    //   handleDeleteUtter({
                    //     utterName: story?.utterName,
                    //   })
                    // }
                  >
                    <icons.MdDeleteForever size={20} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="w-[80%] ">
          <div className="grid grid-cols-2 h-full ">
            <div className="h-full border-r border-blue-gray-300">
              <div className="h-[60px] flex items-center gap-2 justify-between px-4 border-b border-blue-gray-300">
                {isAddStoryForm ? (
                  <Input
                    label="Thêm một story"
                    value={storyValue}
                    onChange={(e) => setStoryValue(e.target.value)}
                  />
                ) : (
                  <Typography className="text-sm font-bold text-blue-600">
                    {selectedStory}
                  </Typography>
                )}
                <div className="col-span-1 flex justify-end gap-2">
                  <button
                    className="border-2 border-blue-gray-800 text-blue-gray-800 bg-white rounded-md px-6 py-2 text-xs font-bold hover:bg-blue-gray-100 transition-all"
                    onClick={() => {
                      setIsAddStoryForm(false);
                      setSelectedStory(storiesData.data[0].story);
                    }}
                  >
                    Huỷ
                  </button>
                  <button
                    className="bg-blue-gray-800 text-white rounded-md px-6 py-2 text-xs font-bold hover:bg-blue-gray-700 transition-all"
                    onClick={handleSaveStory}
                  >
                    Lưu
                  </button>
                  <button
                    className="text-gray-600 hover:text-gray-800"
                    onClick={handleDeleteStory}
                  >
                    <icons.MdDeleteForever size={30} />
                  </button>
                </div>
              </div>
              <div className="h-[calc(100vh-120px)]">
                <YamlEditor
                  yamlValue={storyItem}
                  setYamlValue={setStoryItem}
                  handleChange={handleChange}
                />
              </div>
            </div>
            <div className="h-full border-r border-blue-gray-300">
              <div className="h-[60px] flex items-center border-b border-blue-gray-300">
                <Typography className="text-sm font-bold px-4">Flow</Typography>
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
