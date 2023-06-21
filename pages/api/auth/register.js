import cors from "cors";
import CryptoJS from "crypto-js";
import bcrypt from "bcrypt";
import User from "@/models/userModel";
import connectMongo from "@/utils/dbConfig";

const corsOptions = {
   origin: "*", // Update this to allow requests from specific origins
   methods: ["POST"], // Specify the allowed HTTP methods
};

export default function handler(req, res) {
   // Enable CORS
   cors(corsOptions)(req, res, async () => {
      await connectMongo();

      if (req.method === "POST") {
         const message = req.body;
         var decryptedData = message;
         //Decrypt the message
         /*
         try {
            var bytes = CryptoJS.AES.decrypt(message, process.env.KEY);
            var decryptedData = await JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
         } catch (error) {
            res.status(500).json({ error: "Couldn't decrypt message " + error });
         } */

         //Check if user already exists
         const user = await User.findOne({
            username: decryptedData.username,
         });

         if (user) {
            res.status(500).json({ error: "Username already in use!" });
            return;
         }

         if (decryptedData.password.length < 5) {
            res.status(500).json({ error: "Password needs to be a least 6 characters!" });
            return;
         }

         //If user doesn't exist in database then hash password
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(decryptedData.password, salt);

         const data = {
            username: decryptedData.username,
            password: hashedPassword,
            authorized: false,
            log: false,
         };

         const newUser = new User(data);

         // Save the new new user to MongoDB
         newUser
            .save()
            .then(() => {
               // Log the message
               console.log("Stored:", decryptedData.username);
               // Return a response
               res.status(200).json({
                  success: `User ${data.username} created! Please contact the owner for account activation`,
                  username: data.username,
               });
            })
            .catch((error) => {
               console.log("Error saving user:", error);
               res.status(500).json({ error: "Couldn't save user to database" });
            });
      } else {
         res.status(405).json({ error: "Method Not Allowed" });
      }
   });
}
