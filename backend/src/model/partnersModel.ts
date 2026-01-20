import mongoose from "mongoose";

const PartnersSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

PartnersSchema.index({ company: 1 }, { unique: true });
const PartnersModel = mongoose.model("partners", PartnersSchema);

export default PartnersModel;
