import { Avatar, Breadcrumbs } from "@material-tailwind/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { authSelect } from "../../redux/features/slices/authSlice";
import { icons } from "../../utils/icons";
import { CarouselCustom, Followings, Loading } from "../../components/shares";
import {
  useCreatePostMutation,
  useGetPostDetailQuery,
  useGetPostsQuery,
  useUpdatePostMutation,
} from "../../redux/features/apis/postApi";
import {
  addPost,
  postSelect,
  setPosts,
  updatePostItem,
} from "../../redux/features/slices/postSlice";
import { PostCard } from "../../components/post";
import SidebarProfile from "../../components/layouts/SidebarProfile";

const ForumPage = () => {
  const dispatch = useDispatch();

  const { user, isLoggedIn } = useSelector(authSelect);
  const { posts } = useSelector(postSelect);

  const [showCreatePostForm, setShowCreatePostForm] = useState(false);
  const [imagesPreview, setImagePreview] = useState([]);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const [createPost, { isLoading }] = useCreatePostMutation();
  const [updatePost, { isLoading: isLoadingUpdate }] = useUpdatePostMutation();
  const { data: postsData, isFetching } = useGetPostsQuery(
    { search, limit },
    { refetchOnMountOrArgChange: true }
  );
  const { data: postDetailData } = useGetPostDetailQuery(
    {
      postId: selectedPostId,
    },
    { skip: !selectedPostId, refetchOnMountOrArgChange: true }
  );

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      content: "",
      images: [],
    },
  });

  useEffect(() => {
    if (postsData && postsData.data) {
      dispatch(setPosts({ data: postsData.data }));
    }
  }, [postsData?.data]);

  useEffect(() => {
    if (postDetailData && postDetailData.data) {
      setImagePreview(postDetailData?.data?.images);
      reset({
        ...postDetailData?.data,
      });
    }
  }, [isEditing, selectedPostId, postDetailData?.data]);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
    setValue("images", files);
  };

  const handleToggleShowCreatePostForm = () => {
    setShowCreatePostForm((prev) => !prev);
  };

  const handleCancleUpdatePost = () => {
    setImagePreview([]);
    reset({ content: "", images: [] });
    setShowCreatePostForm(false);
  };

  const handleDeleteImage = () => {
    setImagePreview([]);
    setValue("images", []);
  };

  const handleSubmitCreatePostForm = async (values) => {
    try {
      if (isLoggedIn) {
        const formData = new FormData();

        formData.append("userId", user?._id);
        formData.append("content", values.content);

        for (let i = 0; i < values.images.length; i++) {
          formData.append("images", values.images[i]);
        }

        if (isEditing) {
          const response = await updatePost({
            postId: selectedPostId,
            formData,
          });

          if (response && response.data && response.data.success) {
            dispatch(updatePostItem({ data: response?.data?.data }));
            setShowCreatePostForm(false);
            reset({ content: "", images: [] });
            setImagePreview([]);
            toast.success("Đã cập nhật bài viết");
          }
        } else {
          const response = await createPost({ formData });

          if (response && response.data && response.data.success) {
            dispatch(addPost({ data: response?.data?.data }));
            setShowCreatePostForm(false);
            reset({ content: "", images: [] });
            setImagePreview([]);
            toast.success("Đã thêm bài viết");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative mx-[110px] my-[20px] flex flex-col gap-2">
      {(isLoading || isLoadingUpdate || isFetching) && <Loading />}
      <div className="relative w-full flex gap-2">
        <div className="fixed left-[110px]">
          <SidebarProfile />
        </div>
        <div className="flex flex-col gap-1 pl-[320px] pr-[310px]">
          <div className="sticky w-[678px] z-10 top-[80px] flex items-center gap-4 bg-white p-4 rounded-md">
            <Avatar src={user?.avatar} alt={user?.firstName} />
            <button
              className="border-none hover:bg-blue-gray-100/70 transition-all bg-blue-gray-50 rounded-full w-full px-4 py-3 text-center text-sm font-bold text-blue-gray-600 name"
              onClick={handleToggleShowCreatePostForm}
            >
              Thêm bài viết
            </button>
          </div>
          {showCreatePostForm && (
            <div className="sticky top-[164px] w-[678px] z-10 flex flex-col gap-2 shadow-2xl">
              <form
                className="w-full flex flex-col gap-2 bg-white p-4 rounded-md"
                onSubmit={handleSubmit(handleSubmitCreatePostForm)}
              >
                <textarea
                  {...register("content", { required: "Content is required" })}
                  placeholder="Bạn đang nghĩ gì"
                  className="placeholder:text-blue-gray-700 text-blue-gray-700 text-sm font-semibold bg-blue-gray-50 border-none outline-none min-h-[120px] rounded-md p-4"
                  spellCheck={false}
                />
                {imagesPreview.length > 0 && (
                  <div className="h-[290px] w-full rounded-md border-2 border-blue-gray-200">
                    <CarouselCustom images={imagesPreview} />
                  </div>
                )}
                {isEditing && imagesPreview?.length > 0 && (
                  <label
                    className="text-sm font-semibold text-blue-gray-700 flex items-center justify-center gap-2 cursor-pointer rounded-full py-2 bg-blue-gray-50  hover:bg-blue-gray-100 transition-all"
                    onClick={handleDeleteImage}
                  >
                    Xoá ảnh
                  </label>
                )}
                <label
                  className="flex items-center justify-center gap-2 cursor-pointer rounded-full py-2 bg-blue-gray-50  hover:bg-blue-gray-100 transition-all"
                  htmlFor="images"
                >
                  <span className="text-blue-gray-700">
                    <icons.BsFillImageFill size={24} />
                  </span>
                  <span className="text-sm font-semibold text-blue-gray-700">
                    Thêm ảnh
                  </span>
                </label>
                <input
                  id="images"
                  type="file"
                  hidden
                  multiple
                  onChange={handleImageChange}
                />
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="none"
                      className="flex-1 bg-blue-gray-700 text-sm text-white font-semibold rounded-full text-center py-3 hover:bg-blue-gray-600 transition-all"
                    >
                      Cập nhật
                    </button>
                    <button
                      className="w-[100px] border-2 border-blue-gray-700 text-sm text-blue-gray-700 font-semibold rounded-full text-center py-3 hover:bg-blue-gray-50 transition-all"
                      onClick={handleCancleUpdatePost}
                    >
                      Huỷ
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="bg-blue-gray-700 text-sm text-white font-semibold rounded-full text-center py-3 hover:bg-blue-gray-600 transition-all"
                  >
                    Đăng
                  </button>
                )}
              </form>
            </div>
          )}
          <div className=" flex flex-col gap-1">
            {posts?.length > 0 &&
              posts.map((post) => {
                return (
                  <PostCard
                    post={post}
                    setShowCreatePostForm={setShowCreatePostForm}
                    setSelectedPostId={setSelectedPostId}
                    setIsEditing={setIsEditing}
                    key={post?._id}
                  />
                );
              })}
          </div>
        </div>
        <div className="w-[300px] fixed right-[110px]">
          <Followings />
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
