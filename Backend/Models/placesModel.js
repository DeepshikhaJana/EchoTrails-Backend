import mongoose from "mongoose";
const placeSchema = new mongoose.Schema({
  place_id: {
    type: String,
    required: true,
    unique: true,
  },
  place_name: {
    type: String,
    required: true,
  },
  description: String,
  highlights: [String],
  things_to_do: [String],
  local_cuisine: [String],
  local_crafts: [String],
  visitor_reviews: [String],
  images: [String],
});

const Place = mongoose.models.Place || mongoose.model("Place", placeSchema);
export default Place;