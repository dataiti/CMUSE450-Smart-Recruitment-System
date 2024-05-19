import React, { useEffect, useState } from "react";
import { ButtonCustom } from "../../components/shares";
import { useForm } from "react-hook-form";
import {
  InputController,
  InputFileController,
  TextareaController,
} from "../../components/forms";

const ForumPage = () => {
  const [isShowCreatePostForm, setIsShowCreatePostForm] = useState(false);
  const [values, setValues] = useState({});

  const {
    getValues,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
      hashtag: "",
      link: "",
      pdfFile: "",
    },
  });

  useEffect(() => {
    setValues(getValues());
  }, [getValues]);

  const handleToggleShowCreatePostForm = () => {
    setIsShowCreatePostForm((prev) => !prev);
  };

  const handleSubmitCreatePost = async () => {
    try {
      // const response = await
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-full flex">
      <div className="h-[calc(100vh - 80px)] w-[400px] bg-white border-r border-blue-gray-100">
        <div className="p-3">
          <input
            className="w-full px-4 py-2 bg-blue-gray-50 rounded-full border-none outline-none"
            placeholder="Tìm kiếm ..."
          />
        </div>
        {JSON.stringify(values)}
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <div className="h-[70px] flex items-center gap-4 border border-b bg-white px-5">
          <button
            className="w-full px-4 py-2 bg-blue-gray-50 rounded-full border-none outline-none"
            onClick={handleToggleShowCreatePostForm}
          >
            Thêm bài viết
          </button>
        </div>
        {isShowCreatePostForm && (
          <div className="transition-all">
            <form className="flex flex-col gap-4">
              <InputController
                control={control}
                name="title"
                label="Tiêu đề bài viết"
              />
              <TextareaController
                control={control}
                name="content"
                label="Nội dung bài viết"
              />
              <InputFileController
                control={control}
                name="content"
                label="Nội dung bài viết"
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPage;
