import { Schema, model, models } from "mongoose";

// Define a schema for the message collection
const userSchema = new Schema({
   username: {
      type: String,
      unique: true,
      required: true,
   },
   password: {
      type: String,
      required: true,
      minLength: 6,
   },
   authorized: {
      type: Boolean,
      requiered: false,
   },
   log: {
      type: Boolean,
      requiered: false,
   },
   permissions: {
      type: Object,
      requiered: false,
   },
   countSignIn: {
      type: Number,
      requiered: false,
   },
   lastSignIn: {
      type: String,
      requiered: false,
   },
});

// Create a model based on the schema
const User = models.User || model("user", userSchema);

export default User;
