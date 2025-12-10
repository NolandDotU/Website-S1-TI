import mongoose from "mongoose";

const highlightsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
});

const HighlightModel = mongoose.model(
  "highlights_collection",
  highlightsSchema
);
export default HighlightModel;
