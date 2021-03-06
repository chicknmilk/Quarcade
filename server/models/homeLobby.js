const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create Home and Lobby Schema and model
const HomeLobbySchema = new Schema({
  //object names should start lowercase and be camelcase
  roomCode: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true,
    default: true
  },
  //don't know if we will use this
  startedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  users: [
    {
      socket: {
        type: String,
        required: true
      },
      name: {
        type: String, 
        required: true
      }
    }
  ],
  votesAlphaSoup: {
    type: Number,
    required: true, 
    default: 0
  },
  votesCodeNames: {
    type: Number,
    required: true, 
    default: 0
  }
});

//this saves the HomeLobby model in a homelobbys collection in mongo
const HomeLobby = mongoose.model("homelobby", HomeLobbySchema);
module.exports = HomeLobby;
