import cors from "cors";
import mongoose from "mongoose";
import CryptoJS from "crypto-js";
import bcrypt from "bcrypt";

import Session from "@/models/sessionModel";
import connectMongo from "@/utils/dbConfig";

const corsOptions = {
   origin: "*", // Update this to allow requests from specific origins
   methods: ["GET"], // Specify the allowed HTTP methods
};

export default function handler(req, res) {
   // Enable CORS
   cors(corsOptions)(req, res, async () => {
      if (req.method === "GET") {
         const { sessionid } = req.headers;
         console.log(sessionid);

         await connectMongo();

         //Check if there is an active session
         const session = await Session.findOne({
            session: sessionid,
         });
         console.log(session);
         if (session && session.expires > Date.now()) {
            res.status(200).json({ success: true });
            await Session.findByIdAndUpdate(session._id, { expires: Date.now() + 1000 * 60 * 60 * 3 });
         } else {
            res.status(500).json({ error: "Please Log in! " });
         }
      } else {
         res.status(405).json({ error: "Method Not Allowed" });
      }
   });
}
