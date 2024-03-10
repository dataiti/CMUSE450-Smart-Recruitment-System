import React, { useEffect, useState } from "react";
import { FlowStories, ListStories, YamlEditor } from "../../components/rasas";
import {
  useDeleteStoryMutation,
  useGetStoriesDataQuery,
  useUpdateStoryMutation,
} from "../../redux/features/apis/rasaApi";
import jsyaml from "js-yaml";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  setListStories,
  storiesSelect,
  updateStoryItem,
  removeStoryItem,
} from "../../redux/features/slices/storiesRasaSlice";
import { Typography } from "@material-tailwind/react";
import { icons } from "../../utils/icons";
import { Loading } from "../../components/shares";

const StoriesTrainingPage = () => {
  const dispatch = useDispatch();

  const { listStories, selectedStory } = useSelector(storiesSelect);

  const { data: storiesData } = useGetStoriesDataQuery();
  const [updateStory, { isLoading }] = useUpdateStoryMutation();
  const [deleteStory, { isLoading: isLoadingDelete }] =
    useDeleteStoryMutation();

  const [yamlValue, setYamlValue] = useState("");

  const handleChange = (newValue) => {
    try {
      jsyaml.load(newValue);
      setYamlValue(newValue);
    } catch (error) {
      console.error("YAML Error:", error.message);
      toast.error("Sai cu phap kia");
    }
  };

  useEffect(() => {
    if (storiesData?.data) {
      dispatch(setListStories({ data: storiesData?.data }));
      setYamlValue(jsyaml.dump(selectedStory));
    }
  }, [storiesData, dispatch, setYamlValue, selectedStory]);

  const handleUpdateStory = async () => {
    try {
      const res = await updateStory({
        data: jsyaml.load(yamlValue),
        storyName: selectedStory?.story,
      });
      if (res && res.data) {
        console.log(res);
        dispatch(updateStoryItem({ data: res?.data?.data }));
        toast.success("Lưu story thành công");
      }
    } catch (error) {}
  };

  const handleAddStory = async () => {
    try {
    } catch (error) {}
  };

  const handleDeleteStory = async () => {
    try {
      const res = await deleteStory({
        storyName: selectedStory?.story,
      });
      if (res && res.data) {
        dispatch(removeStoryItem({ data: res?.data?.data }));
        toast.success("Xoá story thành công");
      }
    } catch (error) {}
  };

  return (
    <div className="w-full flex bg-white">
      {(isLoading || isLoadingDelete) && <Loading />}
      <div className="w-[20%] h-screen">
        <ListStories data={listStories} setYamlValue={setYamlValue} />
      </div>
      <div className="w-[80%] h-screen">
        <div className="h-[60px] flex items-center gap-4 border-b px-6 border-blue-gray-200">
          <input
            placeholder="Tìm kiếm stories"
            className="bg-blue-gray-100 outline-none border-none text-sm px-4 py-2 rounded-full w-full placeholder:text-sm placeholder:font-bold placeholder:text-gray-600"
            spellCheck={false}
          />
          <button
            className="text-green-500 hover:text-green-800"
            onClick={handleAddStory}
          >
            <icons.IoAddCircle size={32} />
          </button>
        </div>

        <div className="grid grid-cols-2">
          <div className=" border-r border-blue-gray-200">
            <div className="h-[60px] flex items-center justify-between gap-4 border-b px-6 border-blue-gray-200">
              <Typography className="font-bold text-blue-gray-900">
                {selectedStory?.story}
              </Typography>
              <div className="flex items-center gap-2">
                <button
                  className="text-blue-500 hover:text-blue-800"
                  onClick={handleUpdateStory}
                >
                  <icons.IoIosSave size={30} />
                </button>
                <button
                  className="text-red-500 hover:text-red-800"
                  onClick={handleDeleteStory}
                >
                  <icons.MdDeleteForever size={34} />
                </button>
              </div>
            </div>
            <div className="h-[calc(100vh-120px)]">
              <YamlEditor
                yamlValue={yamlValue}
                setYamlValue={setYamlValue}
                handleChange={handleChange}
              />
            </div>
          </div>
          <div className="h-[calc(100vh-60px)] overflow-y-auto">
            <FlowStories steps={selectedStory?.steps} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoriesTrainingPage;
