import cors from "cors";
import mongoose from "mongoose";
import CryptoJS from "crypto-js";
import bcrypt from "bcrypt";
import User from "@/models/userModel";
import Session from "@/models/sessionModel";
import connectMongo from "@/utils/dbConfig";

import { v4 as uuid } from "uuid";

const corsOptions = {
   origin: "*", // Update this to allow requests from specific origins
   methods: ["POST", "GET"], // Specify the allowed HTTP methods
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
            const result = await bcrypt.compare(decryptedData.password, user.password);

            if (!result) {
               res.status(200).json({ error: "Password incorrect" });
               return;
            }

            if (result && !user.authorized) {
               res.status(200).json({ error: "User not authorized. Please contact the owner!" });
               return;
            }

            //Check if there is already an active session
            await Session.findOneAndDelete({ username: decryptedData.username });

            //Generate session ID
            const sessionId = uuid();

            //Store the session ID to database
            const session = {
               username: decryptedData.username,
               session: sessionId,
               timestamp: Date.now(),
               expires: Date.now() + 1000 * 60 * 60 * 3,
            };

            const newSession = new Session(session);

            // Save the new new user to MongoDB
            newSession
               .save()
               .then(() => {
                  // Log the message
                  console.log("Stored:", session);
                  // Return a response
                  res.status(200).json({
                     success: true,
                     sessiontoken: session.session,
                  });
               })
               .catch((error) => {
                  console.log("Error creating sessions", error);
                  res.status(500).json({ error: "Sessions not created" });
               });

            //Update the userLog
            await User.findOneAndUpdate(
               { username: user.username },
               { lastSignIn: new Date().toLocaleString("en-GB"), countSignIn: user.countSignIn ? user.countSignIn + 1 : 1 }
            );
         } else {
            res.status(200).json({ error: "User doesn't exist" });
         }
      } else {
         res.status(405).json({ error: "Method Not Allowed" });
      }
   });
}
