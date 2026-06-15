const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String,required: true },

  description: {type: String,required: true },

  technologies: {type: [String],required: true },

  githubLink: {type: String },

  liveDemo: {type: String },

  createdAt: {type: Date,default: Date.now },
  
  imageUrl: { type: String, default: "" }

});

module.exports = mongoose.model("Project", projectSchema);

  