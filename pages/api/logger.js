import cors from "cors";
import mongoose from "mongoose";

const corsOptions = {
   origin: "*", // Update this to allow requests from specific origins
   methods: ["POST"], // Specify the allowed HTTP methods
};

// Connect to MongoDB
mongoose
   .connect("mongodb://localhost:27017/otoolslogger", {
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
   message: {
      timestamp: {
         type: Number,
         required: true,
      },
      ip: {
         type: String,
         required: true,
      },
      proxy: {
         type: String,
         required: true,
      },
      text: {
         type: String,
         required: true,
      },
   },
});

// Create a model based on the schema
const Message = mongoose.model("Message", messageSchema);

export default function handler(req, res) {
   // Enable CORS
   cors(corsOptions)(req, res, () => {
      if (req.method === "POST") {
         const { message } = req.body;

         // Create a new message instance
         const newMessage = new Message({ message });

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
               res.status(500).json({ error: "Internal Server Error" });
            });
      } else {
         res.status(405).json({ error: "Method Not Allowed" });
      }
   });
}
