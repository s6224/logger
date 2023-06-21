import cors from "cors";

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
         const { sessionid, username } = req.headers;

         await connectMongo();

         //Check if there is an active session
         const session = await Session.findOne({
            session: sessionid,
            username: username,
         });
         console.log(session);
         if (session) {
            await Session.findByIdAndDelete(session._id);
            res.status(200).json({ success: true });
         } else {
            res.status(500).json({ error: "Couldn't log out the user" });
         }
      } else {
         res.status(405).json({ error: "Method Not Allowed" });
      }
   });
}
