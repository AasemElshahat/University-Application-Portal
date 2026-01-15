import mongoose from "mongoose";
import * as bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  }, 
  lastName: {
    type: String,
  }, 
  isAdministrator: {
    type: Boolean,
    default: false
  },
})

userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')){
    try{
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(user.password, salt);
    } catch (error) {
      return next(error as Error);
    }
  }
  next()
})

userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as any;

  if (update.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

userSchema.set('toJSON', {
  transform: (document, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString()

    delete returnedObject._id;
    delete returnedObject.__v;
  }
})

export const UserModel = mongoose.model("User", userSchema);