import mongoose from "mongoose";

// schema names
const USERS = "users";

// schema definitions
const UserSchema = mongoose.model(
  USERS,
  new mongoose.Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
        tasks: {type: Object , required: false}
    },
    { timestamps: true }
  )
);

export { UserSchema };
