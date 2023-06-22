import { Schema, model, models } from "mongoose";

// Define a schema for the message collection
const sessionSchema = new Schema({
   username: {
      type: String,
      required: true,
   },
   session: {
      type: String,
      required: true,
   },
   log: {
      type: Boolean,
      requiered: false,
   },
   permissions: {
      type: Object,
      requiered: false,
   },
   timestamp: {
      type: Number,
      requiered: true,
   },
   expires: {
      type: Number,
      requiered: true,
   },
});

// Create a model based on the schema
const Session = models.Session || model("session", sessionSchema);

export default Session;
