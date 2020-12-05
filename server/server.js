
const express = require('express');
const app = express();
const { findPosts, getPostsContent, getPostsDates } = require('./models/post')

app.use(express.json());

app.get('/posts', async (req, res) => {
const { search } = req.query
let posts = await findPosts(search)
return res.send(posts)
    })

app.get('/content', async (req, res) => {
let content = await getPostsContent()
return res.send(content)
    })

app.get('/dates', async (req, res) => {
let dates = await getPostsDates()
return res.send(dates)
    })

const PORT = 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
