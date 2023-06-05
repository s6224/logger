import cors from "cors";
import mongoose from "mongoose";
import CryptoJS from "crypto-js";

const corsOptions = {
   origin: "*", // Update this to allow requests from specific origins
   methods: ["POST"], // Specify the allowed HTTP methods
};

// Connect to MongoDB
mongoose
   .connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PW}@127.0.0.1:27017/otools?authSource=admin`, {
      dbName: "otools",
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => {
      console.log("Connected to MongoDB");
   })
   .catch((error) => {
      console.log("MongoDB connection error:", error);
   });

// Define a schema for the message collection
const messageSchema = new mongoose.Schema({
   timestamp: {
      type: Number,
      required: true,
   },
   date: {
      type: String,
      required: true,
   },
   chatId: {
      type: String,
      requiered: true,
   },
   ss: {
      type: String,
      required: false,
   },
   ip: {
      type: String,
      required: false,
   },
   proxy: {
      type: String,
      required: false,
   },
   text: {
      type: String,
      required: false,
   },
});

// Create a model based on the schema
const Message = mongoose.model("MessageV2", messageSchema);

export default function handler(req, res) {
   // Enable CORS
   cors(corsOptions)(req, res, () => {
      if (req.method === "POST") {
         const message = req.body;

         try {
            var bytes = CryptoJS.AES.decrypt(message, process.env.KEY);
            var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
         } catch (error) {
            res.status(500).json({ error: "Couldn't decrypt message" });
         }

         const newMessage = new Message(decryptedData);
         // Save the message to MongoDB
         newMessage
            .save()
            .then(() => {
               // Log the message
               console.log("Received message:", message);

               // Return a response
               res.status(200).json({ success: true });
            })
            .catch((error) => {
               console.log("Error saving message:", error);
               res.status(500).json({ error: "Couldn't save to database" });
            });
      } else {
         res.status(405).json({ error: "Method Not Allowed" });
      }
   });
}
