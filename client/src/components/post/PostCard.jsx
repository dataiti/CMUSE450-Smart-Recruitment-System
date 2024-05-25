import { Avatar, Typography } from "@material-tailwind/react";
import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

import { BoxChat, CarouselCustom, Loading } from "../shares";
import { icons } from "../../utils/icons";
import { socket } from "../../socket";
import { authSelect } from "../../redux/features/slices/authSlice";
import {
  useDeletePostMutation,
  useToggleLikePostMutation,
} from "../../redux/features/apis/postApi";
import {
  postSelect,
  removePostItem,
  updatePostItem,
} from "../../redux/features/slices/postSlice";

const PostCard = ({
  post = {},
  setShowCreatePostForm,
  setSelectedPostId,
  setIsEditing,
}) => {
  const dispatch = useDispatch();

  const { user, isLoggedIn } = useSelector(authSelect);
  const { posts } = useSelector(postSelect);

  const [isBoxChatOpen, setIsBoxChatOpen] = useState(false);
  const [isBoxChatBubble, setIsBoxChatBubble] = useState(false);
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [commentInputValue, setCommentInputValue] = useState("");
  const [isShowComments, setIsShowComments] = useState(false);

  const [deletePost, { isLoading }] = useDeletePostMutation();
  const [toggleLikePost] = useToggleLikePostMutation();

  // useEffect(() => {
  //   posts.forEach((post) => {
  //     if (post.likes.includes(user?._id)) {
  //       setIsLike(true);
  //     }
  //   });
  // }, [posts]);

  useEffect(() => {
    if (socket) {
      socket.on("comment_started_by_post", (data) => {
        if (data && data.success) {
        }
      });
    }

    return () => {};
  }, [socket]);

  const handleStartConversation = () => {
    if (!isLoggedIn) {
      setIsOpenLoginModal(true);
    } else {
      setIsBoxChatOpen(true);
      setIsBoxChatBubble(false);
      try {
        socket?.emit("start_conversation", {
          employerId: post?.employerId?._id,
          userId: user?._id,
        });
      } catch (error) {}
    }
  };

  const handleStartEditPost = () => {
    setShowCreatePostForm(true);
    setIsEditing(true);
    setSelectedPostId(post?._id);
  };

  const handleToggleLikePost = async () => {
    try {
      const response = await toggleLikePost({
        postId: post?._id,
        data: { userId: user?._id },
      });

      if (response && response.data && response.data.success) {
        dispatch(updatePostItem({ data: response?.data?.data }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStartCommentPost = () => {
    setIsShowComments((prev) => !prev);
  };

  const countComments = (comments) => {
    let count = comments.length;
    comments.forEach((comment) => {
      if (comment.replies && comment.replies.length > 0) {
        count += countComments(comment.replies);
      }
    });
    return count;
  };

  const handleDeletePost = async () => {
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
          const response = await deletePost({ postId: post?._id });

          if (response && response.data && response.data.success) {
            dispatch(removePostItem({ _id: post?._id }));
            toast.success("Xoá tin bài viết thành công !");
          }
        }
      });
    } catch (error) {}
  };

  return (
    <div
      className="group relative flex flex-col gap-4 bg-white py-4 px-10 rounded-md"
      key={post._id}
    >
      {isLoading && <Loading />}
      {isBoxChatOpen && (
        <BoxChat
          isBoxChatOpen={isBoxChatOpen}
          setIsBoxChatOpen={setIsBoxChatOpen}
          setIsBoxChatBubble={setIsBoxChatBubble}
          isBoxChatBubble={isBoxChatBubble}
        />
      )}
      {isBoxChatBubble && (
        <button
          className="h-14 w-14 flex items-center justify-center rounded-full bg-[#212f3f] text-light-blue-600 fixed bottom-[90px] right-6 shadow-2xl z-40"
          onClick={() => {
            setIsBoxChatBubble(false);
            setIsBoxChatOpen(true);
          }}
        >
          <icons.BsMessenger size={28} />
        </button>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            src={post?.userId?.avatar || post?.employerId?.companyLogo}
            alt=""
            className="h-10 w-10 bg-blue-gray-100 p-1"
          />
          <div className="flex flex-col">
            {post?.userId ? (
              <Typography className="text-sm text-blue-gray-700 font-bold">
                {post?.userId?.firstName} {post?.userId?.lastName}
              </Typography>
            ) : (
              <Typography className="text-sm text-blue-gray-700 font-bold">
                {post?.employerId?.companyName}
              </Typography>
            )}
            <Typography className="italic text-xs text-gray-500 font-semibold">
              {post?.userId?.email || post?.employerId?.companyIndustry}
            </Typography>
          </div>
        </div>
        {user?._id === post?.userId?._id && (
          <div className="group-hover:flex hidden items-center gap-2 bg-blue-gray-50 rounded-full px-4 py-2">
            <button className="text-gray-600" onClick={handleDeletePost}>
              <icons.MdDeleteForever size={24} />
            </button>
            <button className="text-gray-600" onClick={handleStartEditPost}>
              <icons.FiEdit size={20} />
            </button>
          </div>
        )}
      </div>
      <Typography className="bg-blue-gray-50 rounded-md p-3 whitespace-pre-line text-sm font-semibold text-gray-700">
        {post?.content}
      </Typography>
      {post?.images?.length > 0 && (
        <div className="h-full w-full rounded-md border border-blue-gray-200">
          <CarouselCustom images={post?.images} isNaviagtion={false} />
        </div>
      )}
      <div className="h-[1px] rounded-full bg-blue-gray-100"></div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className=" text-blue-gray-700 hover:text-blue-gray-800"
            onClick={handleToggleLikePost}
          >
            {isLike ? (
              <icons.IoMdHeart size={28} />
            ) : (
              <icons.IoMdHeartEmpty size={28} />
            )}
          </button>
          <span className="text-sm font-semibold">
            {post?.likes?.length} lượt thích
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="text-blue-gray-700 hover:text-blue-gray-800"
            onClick={handleStartCommentPost}
          >
            <icons.AiOutlineComment size={28} />
          </button>
          <span className="text-sm font-semibold">
            {countComments(post?.comments || [])} lượt bình luận
          </span>
        </div>
        {post?.employerId && (
          <button
            className="text-blue-gray-700 hover:text-blue-gray-800"
            onClick={handleStartConversation}
          >
            <icons.IoChatbubbleEllipsesOutline size={24} />
          </button>
        )}
      </div>
      <div className="h-[1px] rounded-full bg-blue-gray-100"></div>
      <div className="bg-blue-gray-50 flex items-center gap-2 p-2 border border-blue-gray-100  rounded-full">
        <Avatar src={user?.avatar} alt="" className="h-8 w-8" />
        <input
          value={commentInputValue}
          onChange={(e) => setCommentInputValue(e.target.value)}
          placeholder="Nhập bình luận"
          className="bg-transparent outline-none border-none flex-1 text-sm font-semibold text-blue-gray-700 placeholder:text-sm"
          spellCheck={false}
        />
        <button className="active:bg-blue-gray-600 flex items-center justify-center h-8 w-8 rounded-full bg-blue-gray-700 text-light-blue-500">
          <icons.IoMdSend size={20} />
        </button>
      </div>
      {isShowComments && post?.comments?.length > 0 && (
        <div>
          {post?.comments?.map((comment) => {
            return (
              <div key={comment?._id}>
                <Avatar
                  src={comment?.userId?.avatar}
                  alt=""
                  className="h-8 w-8"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PostCard;
