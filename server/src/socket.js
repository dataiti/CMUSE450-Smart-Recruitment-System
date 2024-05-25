const Message = require("../src/models/message");
const Employer = require("../src/models/employer");
const User = require("../src/models/user");
const Notification = require("../src/models/notification");
const ApplyJob = require("../src/models/applyJob");
const Schedule = require("../src/models/schedule");
const Chatbot = require("../src/models/chatbot");
const RasaConversation = require("../src/models/rasaConversation");
const RasaMessage = require("../src/models/rasaMessage");
const { model } = require("./configs/googleAIConfig");

const socket = async (socket, io) => {
  const userId = socket.handshake.query["userId"];
  const employerId = socket.handshake.query["employerId"];

  if (userId) console.log(`✅ User ${userId} connected socket is successfully`);
  if (employerId)
    console.log(`✅ Employer ${employerId} connected socket is successfully`);

  if (Boolean(userId) && userId !== null) {
    try {
      await User.findByIdAndUpdate(userId, {
        socketId: socket.id,
      });
    } catch (error) {
      console.log(error);
    }
  }

  if (Boolean(employerId) && employerId !== null) {
    try {
      await Employer.findByIdAndUpdate(employerId, {
        socketId: socket.id,
      });
    } catch (error) {
      console.log(error);
    }
  }

  socket.on("user_list_conversations", async ({ userId }) => {
    try {
      const existingConversations = await Message.find({
        userId,
      })
        .sort("-updatedAt")
        .populate("userId", "firstName lastName avatar email")
        .populate("employerId", "companyLogo companyName companyEmail");

      const formatData = existingConversations.map((conversation) => {
        return {
          _id: conversation._id,
          employerId: conversation.employerId,
          lastMessage: conversation.messages[conversation.messages.length - 1],
        };
      });

      socket.emit("user_get_list_conversations", {
        message: formatData,
      });
    } catch (error) {}
  });

  socket.on("employer_list_conversations", async ({ employerId }) => {
    try {
      const existingConversations = await Message.find({
        employerId,
      })
        .populate("userId", "firstName lastName avatar email")
        .populate("employerId", "companyLogo companyName companyEmail");

      let formatData = existingConversations.map((conversation) => {
        return {
          _id: conversation._id,
          userId: conversation.userId,
          lastMessage: conversation.messages[conversation.messages.length - 1],
        };
      });

      socket.emit("employer_get_list_conversations", {
        message: formatData,
      });
    } catch (error) {}
  });

  socket.on("start_conversation", async (message) => {
    try {
      const { employerId, userId } = message;

      const existingConversations = await Message.find({
        employerId,
        userId,
      })
        .populate("userId", "firstName lastName avatar email")
        .populate("employerId", "companyLogo companyName companyEmail");

      if (existingConversations.length === 0) {
        let newChat = await Message.create({
          employerId,
          userId,
        });

        newChat = await Message.findById(newChat)
          .populate("userId", "firstName lastName avatar email")
          .populate("employerId", "companyLogo companyName companyEmail");

        socket.emit("start_chat", { success: true, message: newChat });
      } else {
        socket.emit("start_chat", {
          success: true,
          message: existingConversations[0],
        });
      }
    } catch (error) {}
  });

  socket.on("get_messages", async (data) => {
    try {
      const { messageId } = data;
      const messages = await Message.findById(messageId)
        .populate("userId", "firstName lastName avatar email")
        .populate("employerId", "companyLogo companyName companyEmail");

      socket.emit("user_get_message", {
        success: true,
        message: messages,
      });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("text_message", async (message) => {
    try {
      const { sender, content, employerId, userId, type, messageId } = message;

      const findEmployer = await Employer.findById(employerId);
      const findUser = await User.findById(userId);

      const newMessage = {
        sender,
        content,
        type,
        createdAt: Date.now(),
      };

      const findMessage = await Message.findById(messageId)
        .populate("userId", "firstName lastName avatar email")
        .populate("employerId", "companyLogo companyName companyEmail");
      findMessage.messages.push(newMessage);

      await findMessage.save({ new: true, validateModifiedOnly: true });

      io.to(findUser?.socketId).emit("new_message", {
        success: true,
        message: findMessage,
      });
      io.to(findEmployer?.socketId).emit("new_message", {
        success: true,
        message: findMessage,
      });
    } catch (error) {}
  });

  socket.on("follow_employer", async (data) => {
    const { userId, employerId } = data;
    try {
      const user = await User.findById(userId);

      const employer = await Employer.findById(employerId);

      if (!user || !employer) return;

      console.log(employer.followerIds);

      if (employer.followerIds.includes(userId)) return;

      employer.followerIds.push(userId);
      await employer.save();

      user.followingIds.push(employerId);
      await user.save();

      io.to(employer?.socketId).emit("new_follower", { userId });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("unfollow_employer", async (data) => {
    const { userId, employerId } = data;
    try {
      const user = await User.findById(userId);

      const employer = await Employer.findById(employerId);

      if (!user || !employer) return;

      console.log(employer.followerIds);

      if (!employer.followerIds.includes(userId)) return;

      employer.followerIds = employer.followerIds.filter(
        (follower) => follower.toString() !== userId.toString()
      );
      await employer.save();

      user.followingIds = user.followingIds.filter(
        (employer) => employer.toString() !== employerId.toString()
      );
      await user.save();

      io.to(employer.ownerId.socketId).emit("unfollowed", { userId });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("employer_send_notification", async (message) => {
    const { userId, employerId, title, content, type } = message;
    try {
      const user = await User.findById(userId);

      const employer = await Employer.findById(employerId);

      if (!user || !employer) return;

      const newNotification = new Notification({
        userId,
        employerId,
        title,
        content,
        type,
      });

      const savedNewNotification = await newNotification.save();

      const notificationPopulated = await Notification.findById(
        savedNewNotification._id
      )
        .populate("userId", "firstName lastName _id avatar email status")
        .populate(
          "employerId",
          "companyLogo companyName companyEmail _id companyPhoneNumber"
        );

      io.to(user?.socketId).emit("user_get_notification", {
        success: true,
        message: notificationPopulated,
      });

      io.to(employer?.socketId).emit("employer_get_notification", {
        success: true,
        message: notificationPopulated,
      });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("user_view_notification", async (message) => {
    const { notificationId, userId } = message;
    try {
      const user = await User.findById(userId);

      if (!user) return;

      const notificationPopulated = await Notification.findById(notificationId)
        .populate("userId", "firstName lastName _id avatar email status")
        .populate(
          "employerId",
          "companyLogo companyName companyEmail _id companyPhoneNumber"
        );

      notificationPopulated.isViewed = true;
      await notificationPopulated.save();

      io.to(user?.socketId).emit("user_viewed_notification", {
        sucess: true,
        message: notificationPopulated,
      });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("get_list_notifications", async (message) => {
    const { userId } = message;
    try {
      const user = await User.findById(userId);

      if (!user) return;

      const listNotifications = await Notification.find({
        userId,
      })
        .sort("-_id")
        .populate("userId", "firstName lastName _id avatar email status")
        .populate(
          "employerId",
          "companyLogo companyName companyEmail _id companyPhoneNumber"
        );

      io.to(user?.socketId).emit("user_get_list_notifications", {
        sucess: true,
        message: listNotifications,
      });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("chatbot_conversation", async (message) => {
    const { userId } = message;
    try {
      let listChatbots;
      if (userId) {
        listChatbots = await Chatbot.find({
          userId,
        }).populate("userId", "firstName lastName _id avatar email status");
      }

      socket.emit("get_chatbot_conversation", {
        success: true,
        message: userId ? listChatbots : [],
      });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("send_question", async (message) => {
    const { prompt, userId } = message;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      let listChatbots;

      if (userId) {
        const newChatbot = new Chatbot({
          userId,
          prompt,
          text,
        });

        await newChatbot.save();

        listChatbots = await Chatbot.find({
          userId,
        }).populate("userId", "firstName lastName _id avatar email status");
      }

      socket.emit("get_chatbot_conversation", {
        success: true,
        message: userId ? listChatbots : text,
      });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("employer_reject_CV", async (message) => {
    const { userId, employerId, applyJobId } = message;
    try {
      const applyJob = await ApplyJob.findById(applyJobId);
      const user = await User.findById(userId);
      const employer = await Employer.findById(employerId);

      if (!user || !applyJob || !employer) {
        return;
      }

      const apply = await ApplyJob.findByIdAndUpdate(
        applyJobId,
        { $set: { status: "rejected" } },
        { new: true }
      );

      const newNotification = new Notification({
        userId,
        employerId,
        applyJobId,
        title: `Thông báo từ ${employer?.companyName}`,
        content: `${employer?.companyName} đã từ chối CV mà bạn đã ứng tuyển. Xem ngay`,
        type: "message",
      });

      await newNotification.save();

      const listNotifications = await Notification.find({ userId })
        .sort("-_id")
        .populate("userId", "firstName lastName _id avatar email status")
        .populate(
          "employerId",
          "companyLogo companyName companyEmail _id companyPhoneNumber"
        );

      io.to(user?.socketId).emit("user_get_list_notifications", {
        success: true,
        message: listNotifications,
      });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("employer_interview_invition_CV", async (message) => {
    const { userId, employerId, applyJobId, data } = message;
    const {
      title,
      interviewerName,
      interviewerEmail,
      interviewerPhoneNumber,
      scheduleDate,
      location,
      endTime,
      startTime,
      typeMeeting,
      content,
    } = data;
    try {
      const applyJob = await ApplyJob.findById(applyJobId);
      const user = await User.findById(userId);
      const employer = await Employer.findById(employerId);

      if (!user || !applyJob || !employer) return;

      await ApplyJob.findByIdAndUpdate(
        applyJobId,
        { $set: { status: "invited" } },
        { new: true }
      );

      const startDateTime = new Date(`${scheduleDate}T${startTime}`);
      const endDateTime = new Date(`${scheduleDate}T${endTime}`);

      const newSchedule = new Schedule({
        userId,
        employerId,
        applyJobId,
        title,
        interviewerName,
        interviewerEmail,
        interviewerPhoneNumber,
        status: typeMeeting === "online" ? "online" : "offline",
        type: "pending",
        start: startDateTime,
        end: endDateTime,
        location,
        // content,
      });

      await newSchedule.save();

      const newNotification = new Notification({
        userId,
        employerId,
        applyJobId,
        title: `Thông báo từ ${employer?.companyName}`,
        content: `${employer?.companyName} đã gửi lời mời phỏng vấn. Xem ngay`,
        type: "invitation",
      });

      await newNotification.save();

      const listNotifications = await Notification.find({ userId })
        .sort("-_id")
        .populate("userId", "firstName lastName _id avatar email status")
        .populate(
          "employerId",
          "companyLogo companyName companyEmail _id companyPhoneNumber"
        );

      io.to(user?.socketId).emit("user_get_list_notifications", {
        success: true,
        message: listNotifications,
        data: data,
      });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("user_cancel_intiviton_CV", async (message) => {
    const { userId, employerId, applyJobId, notificationId, scheduleId } =
      message;
    try {
      const applyJob = await ApplyJob.findById(applyJobId);
      const user = await User.findById(userId);
      const employer = await Employer.findById(employerId);

      if (!user || !applyJob || !employer) return;

      await ApplyJob.findByIdAndUpdate(
        applyJobId,
        { $set: { status: "canceled" } },
        { new: true }
      );

      const newNotification = new Notification({
        employerId,
        title: `Thông báo từ ${user?.firstName} ${user?.lastName} `,
        content: `${user?.firstName} ${user?.lastName} đã huỷ lời mời phỏng vấn. Xem lịch ngay`,
        type: "message",
      });

      await Schedule.findOneAndDelete({ _id: scheduleId });

      await newNotification.save();
      const updateNotification = await Notification.findOneAndUpdate(
        { _id: notificationId },
        { $set: { isViewed: true } }
      );

      const listNotifications = await Notification.find({ userId })
        .sort("-_id")
        .populate("userId", "firstName lastName _id avatar email status")
        .populate(
          "employerId",
          "companyLogo companyName companyEmail _id companyPhoneNumber"
        );

      const listNotificationsEmployer = await Notification.find({
        employerId,
        type: { $ne: "invitation" },
      })
        .sort("-_id")
        .populate("userId", "firstName lastName _id avatar email status")
        .populate(
          "employerId",
          "companyLogo companyName companyEmail _id companyPhoneNumber"
        );

      io.to(user?.socketId).emit("user_get_list_notifications", {
        success: true,
        message: listNotifications,
      });
      io.to(employer?.socketId).emit("employer_get_list_notifications", {
        success: true,
        message: listNotificationsEmployer,
      });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("user_accepted_intiviton_CV", async (message) => {
    const { userId, employerId, applyJobId, notificationId } = message;
    try {
      const applyJob = await ApplyJob.findById(applyJobId);
      const user = await User.findById(userId);
      const employer = await Employer.findById(employerId);

      if (!user || !applyJob || !employer) return;

      await ApplyJob.findByIdAndUpdate(
        applyJobId,
        { $set: { status: "progressing" } },
        { new: true }
      );

      const newNotification = new Notification({
        employerId,
        title: `Thông báo từ ${user?.firstName} ${user?.lastName} `,
        content: `${user?.firstName} ${user?.lastName} đã đồng ý lời mời phỏng vấn. Xem lịch ngay`,
        type: "message",
      });

      await newNotification.save();
      const updateNotification = await Notification.findOneAndUpdate(
        { _id: notificationId },
        { $set: { isViewed: true } }
      );

      const listNotifications = await Notification.find({ userId })
        .sort("-_id")
        .populate("userId", "firstName lastName _id avatar email status")
        .populate(
          "employerId",
          "companyLogo companyName companyEmail _id companyPhoneNumber"
        );

      const listNotificationsEmployer = await Notification.find({
        employerId,
        type: { $ne: "invitation" },
      })
        .sort("-_id")
        .populate("userId", "firstName lastName _id avatar email status")
        .populate(
          "employerId",
          "companyLogo companyName companyEmail _id companyPhoneNumber"
        );

      io.to(user?.socketId).emit("user_get_list_notifications", {
        success: true,
        message: listNotifications,
      });
      io.to(employer?.socketId).emit("employer_get_list_notifications", {
        success: true,
        message: listNotificationsEmployer,
      });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("update_status_apply_job", async (message) => {
    const { userId, employerId, applyJobId, status } = message;
    try {
      const applyJob = await ApplyJob.findById(applyJobId);
      const user = await User.findById(userId);
      const employer = await Employer.findById(employerId);

      if (!user || !applyJob || !employer) return;

      const updateApplyJob = await ApplyJob.findByIdAndUpdate(
        applyJobId,
        { $set: { status } },
        { new: true }
      );

      socket.emit("employer_get_status_apply_job", {
        success: true,
        message: updateApplyJob.status,
      });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("employer_list_notifications", async (message) => {
    const { employerId } = message;
    try {
      const employer = await Employer.findById(employerId);

      if (!employer) return;

      const listNotifications = await Notification.find({
        employerId,
        type: { $ne: "invitation" },
      })
        .sort("-_id")
        .populate("userId", "firstName lastName _id avatar email status")
        .populate(
          "employerId",
          "companyLogo companyName companyEmail _id companyPhoneNumber"
        );

      socket.emit("employer_get_list_notifications", {
        success: true,
        message: listNotifications,
      });
    } catch (error) {
      console.error(error);
    }
  });

  // chatbot rasa
  socket.on("start_conversation_with_rasa_chatbot", async (data) => {
    try {
      const { from, to, limit } = data;

      if (!from || !to) return;

      // Kiểm tra xem trong cuộc trò chuyện đã tồn tại chưa
      const existingConversation = await RasaConversation.find({
        participantsIds: { $size: 2, $all: [from, to] },
      })
        .populate("participantsIds", "firstName lastName avatar email")
        .populate({
          path: "messageIds",
          populate: {
            path: "senderId",
            model: "User",
            select: "firstName lastName avatar email",
          },
        });

      // Nếu cuộc trò chuyện chưa tồn tại, tạo mới to và from
      if (existingConversation.length === 0) {
        let newRasaConversation = new RasaConversation({
          participantsIds: [from, to],
        });
        await newRasaConversation.save();

        // Gửi thông tin về cuộc trò chuyện mới được tạo đến client
        const newConversation = await RasaConversation.findById(
          newRasaConversation._id
        )
          .populate("participantsIds", "firstName lastName avatar email")
          .populate({
            path: "messageIds",
            populate: {
              path: "senderId",
              model: "User",
              select: "firstName lastName avatar email",
            },
          });

        socket.emit("conversation_started_with_chatbot", {
          success: true,
          data: newConversation,
        });
      } else {
        socket.emit("conversation_started_with_chatbot", {
          success: true,
          data: existingConversation[0],
        });
      }
    } catch (error) {
      console.error(
        "Error handling start_conversation_with_chatbot event:",
        error
      );
    }
  });

  socket.on("send_question_rasa_chatbot", async (data) => {
    try {
      const {
        from,
        to,
        message,
        buttons,
        employers,
        image,
        charts,
        jobs,
        conversationId,
      } = data;

      if (!from || !to || !message || !conversationId) return;

      const findFrom = await User.findById(from);
      const findTo = await User.findById(to);

      // Kiểm tra nếu không có người gửi và người nhận trong DB thì return
      if (!findFrom || !findTo) return;

      // Tạo mesage mới và lưu
      const newRasaMessage = new RasaMessage({
        senderId: from,
        conversationId,
        message,
        buttons,
        employers,
        image,
        charts,
        jobs,
      });

      await newRasaMessage.save();

      // Tìm và thêm message vừa tạo vào cuộc trò chuyện
      const findConversation = await RasaConversation.findById({
        _id: conversationId,
      })
        .populate("participantsIds", "firstName lastName avatar email")
        .populate({
          path: "messageIds",
          populate: {
            path: "senderId",
            model: "User",
            select: "firstName lastName avatar email",
          },
        });

      findConversation.messageIds.push(newRasaMessage._id);

      await findConversation.save();

      const findMessage = await RasaMessage.findById(
        newRasaMessage._id
      ).populate("senderId", "firstName lastName avatar email");

      // gửi tin data lại cho người gửi
      io.to(findFrom?.socketId).emit("question_sent_to_rasa_chatbot", {
        success: true,
        data: findMessage,
      });

      // gửi tin data lại cho người nhận
      io.to(findTo?.socketId).emit("question_sent_to_rasa_chatbot", {
        success: true,
        data: findMessage,
      });
    } catch (error) {}
  });

  socket.on("list_conversations_rasa_chatbot", async (data) => {
    try {
      const { userId } = data;

      const search = data.search ? data.search : "";

      const searchRegex = search
        .split(" ")
        .filter((q) => q)
        .join("|");

      if (!userId) return;

      const findUser = await User.findById(userId);

      // Kiểm tra nếu không tìm thấy người dùng trong DB thì return
      if (!findUser) return;

      // Tìm tất cả cuộc trò chuyện của người dùng
      let findConversations = await RasaConversation.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "participantsIds",
            foreignField: "_id",
            as: "participants",
          },
        },
        {
          $lookup: {
            from: "rasamessages",
            localField: "messageIds",
            foreignField: "_id",
            as: "messages",
          },
        },
        {
          $match: {
            $or: [
              {
                "participants.firstName": {
                  $regex: searchRegex,
                  $options: "i",
                },
              },
              {
                "participants.lastName": { $regex: searchRegex, $options: "i" },
              },
              { "participants.email": { $regex: searchRegex, $options: "i" } },
              { "messages.message": { $regex: searchRegex, $options: "i" } },
            ],
          },
        },
      ]);

      // Lấy ra mảng các _id từ findConversations
      const conversationIds = findConversations.map((item) => item._id);

      // Thực hiện truy vấn find và populate dữ liệu từ RasaConversation
      findConversations = await RasaConversation.find({
        _id: { $in: conversationIds },
      })
        .populate({
          path: "participantsIds",
          select: "firstName lastName avatar email",
        })
        .populate("messageIds");

      // Sắp xếp danh sách cuộc trò chuyện theo thời gian mới nhất
      findConversations.sort((a, b) => {
        const lastMessageTimeA =
          a.messageIds.length > 0
            ? a.messageIds[a.messageIds.length - 1].createdAt
            : a.createdAt;
        const lastMessageTimeB =
          b.messageIds.length > 0
            ? b.messageIds[b.messageIds.length - 1].createdAt
            : b.createdAt;
        return new Date(lastMessageTimeB) - new Date(lastMessageTimeA);
      });

      // Định dạng lại dữ liệu để trả về
      const result = findConversations.map((conversation) => {
        const lastMessage =
          conversation.messageIds.length > 0
            ? conversation.messageIds[conversation.messageIds.length - 1]
            : "Các bạn đã được kết nối";
        const sender = conversation.participantsIds.find(
          (participant) => participant._id.toString() !== userId.toString()
        );

        return {
          _id: conversation._id,
          sender,
          lastMessage,
        };
      });

      // Gửi danh sách cuộc trò chuyện về cho người dùng
      socket.emit("get_list_conversations_rasa_chatbot", {
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(error);
    }
  });
};

module.exports = socket;
