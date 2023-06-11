import mongoose from "mongoose";

const connectMongo = async () => {
   console.log("Connecting to mongo...");
   try {
      mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PW}@193.149.189.8:27017/otools?authSource=admin`);
      console.log("Connected to mongo!");
   } catch (error) {
      console.log("Connection to mongo failed ", error);
   }
};

export default connectMongo;
