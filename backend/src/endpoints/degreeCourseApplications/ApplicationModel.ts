import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  applicantUserID: {
    type: String,
    required: true
  },
  degreeCourseID:{
    type: String,
    required: true
  },
  targetPeriodYear:{
    type: Number,
    required: true
  },
  targetPeriodShortName:{
    type:String,
    required: true
  }
})

applicationSchema.set("toJSON", {
  transform: (document, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString()

    delete returnedObject._id;
    delete returnedObject.__v;
  }
})

export const ApplicationModel = mongoose.model("Application", applicationSchema) 