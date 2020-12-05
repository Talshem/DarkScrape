const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("useFindAndModify", false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const PostSchema = new mongoose.Schema({
  url: String,
  author: String,
  title: String,
  content: Array,
  date: Date,
});

PostSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Post = mongoose.model("Post", PostSchema);

const createPost = (post) => {
  const { url, title, content, author, date } = post;
  const newPost = new Post({
    url: url,
    title: title,
    content: content,
    author: author,
    date: date,
  });
  newPost.save().then(() => {
    return newPost;
  });
};

const findPosts = async (search) => {
  const result =
    search && search !== ""
      ? await Post.find({
          $or: [
            { title: { $regex: new RegExp(search, "i") } },
            { content: { $regex: new RegExp(search, "i") } },
            { author: { $regex: new RegExp(search, "i") } },
          ],
        })
      : await Post.find({});
  return result;
};

const getPostsContent = async () => {
  const result = await Post.find({}).select('date content');
  return result.map(ticket => ({content: ticket.content.join(), date: ticket.date}));
};

const getPostsDates = async () => {
  const result = await Post.find({}).select('date');
  return result.map(ticket => ticket.date);
};

const findPostsByUrl = async (url) => {
  const result = await Post.findOne({ url: url });
  return result;
};

module.exports = { Post, createPost, findPosts, findPostsByUrl, getPostsContent, getPostsDates };
