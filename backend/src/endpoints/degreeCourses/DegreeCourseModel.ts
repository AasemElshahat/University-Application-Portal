import mongoose from "mongoose";

const degreeCourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  shortName: {
    type: String,
    required: true
  },
  universityName: {
    type: String,
    required: true
  },
  universityShortName: {
    type: String,
    required: true
  },
  departmentName: {
    type: String,
    required: true
  },
  departmentShortName: {
    type: String,
    required: true,
  }
})

degreeCourseSchema.set("toJSON", {
  transform: (document, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString()

    delete returnedObject._id;
    delete returnedObject.__v;
  }
})

export const DegreeCourseModel = mongoose.model("DegreeCourse", degreeCourseSchema)