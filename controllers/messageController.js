import Conversation from "../models/conversationModel.js"
import Message from "../models/messageModel.js"
import { getReceiverSocketId, io } from "../socket/socket.js"

import { Message } from '../models/messageModel.js';
import { Conversation } from '../models/conversationModel.js';

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Tìm hoặc tạo conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: []
      });
    }

    // Tạo tin nhắn mới
    const newMessage = new Message({
      senderId,
      receiverId,
      message
    });

    // Thêm message ID vào conversation
    conversation.messages.push(newMessage._id);

    // Lưu đồng thời
    await Promise.all([conversation.save(), newMessage.save()]);

    // Phát tin nhắn qua Socket.IO
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }

    res.status(201).json(newMessage); // Trả về object tin nhắn
  } catch (error) {
    console.log('Error in sendMessage:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMessage = async (req, res) => {
  try {
    const {id: userToChatId} = req.params
    const senderId = req.user._id

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId]}
    }).populate("messages") //not ref but actual messages

    if(!conversation) return res.status(200).json({})
    const messages = conversation.messages

    res.status(200).json(messages)

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server"})
  }
}
