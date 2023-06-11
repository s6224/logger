import { Schema, model, models } from "mongoose";

// Define a schema for the message collection
const messageSchema = new Schema({
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
const Message = models.Message || model("MessageV2", messageSchema);

export default Message;
