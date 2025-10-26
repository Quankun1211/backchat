import Conversation from "../models/conversationModel.js"
import Message from "../models/messageModel.js"
import { getReceiverSocketId, io } from "../socket/socket.js"

const sendMessage = async (message) => {
  setLoading(true);
  try {
    const res = await fetch(`https://backchat-5.onrender.com/api/messages/send/${selectedConversation._id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      credentials: 'include'
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    if (data && typeof data === 'object' && data._id) {
      setMessages([...messages, data]);
    } else {
      console.error('Invalid message data:', data);
    }
  } catch (error) {
    toast.error(error.message);
    console.log(error.message);
  } finally {
    setLoading(false);
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
