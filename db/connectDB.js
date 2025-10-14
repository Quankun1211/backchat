import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // tránh treo quá lâu
    });
    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:");
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
    process.exit(1); // dừng server nếu không kết nối được
  }
};

export default connect;
