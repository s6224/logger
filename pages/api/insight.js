import cors from "cors";
import CryptoJS from "crypto-js";
import Message from "@/models/insightModel";
import connectMongo from "@/utils/dbConfig";

const corsOptions = {
   origin: "*", // Update this to allow requests from specific origins
   methods: ["POST"], // Specify the allowed HTTP methods
};

export default function handler(req, res) {
   // Enable CORS
   cors(corsOptions)(req, res, async () => {
      if (req.method === "POST") {
         const message = req.body;
         try {
            var bytes = CryptoJS.AES.decrypt(message, process.env.KEY);
            var decryptedData = await JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
         } catch (error) {
            res.status(500).json({ error: "Couldn't decrypt message " + error });
         }

         await connectMongo();

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
