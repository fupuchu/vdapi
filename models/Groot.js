const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GrootSchema = new Schema({
  key: {
    type: String,
    require: true
  },
  value: {
    type: String,
    require: true
  },
  timestamp: {
    type: String,
    require: true
  },
  history: [
    {
      lastUpdate: {
        type: String,
        required: true
      },
      lastValue: {
        type: String,
        required: true
      }
    }
  ],
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("groots", GrootSchema);
