import express from "express";
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;
let blogPosts = [];

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
    res.status(200).render("index.ejs", { blogPosts });
});

app.get("/new-blog", (req, res) => {
    res.status(200).render("new-blog.ejs");
});

app.post("/create-blog", (req, res) => {
    const { title, content } = req.body;
    const newBlogPost = { id: uuidv4(), title, content };
    blogPosts.push(newBlogPost);
    res.status(201).redirect("/");
});

app.get("/edit-blog/:id", (req, res) => {
    const { id } = req.params;
    const blogPost = blogPosts.find(post => post.id === id);
    if (!blogPost) {
        return res.status(404).send('Blog post not found');
    }
    res.status(200).render("edit-blog.ejs", { blogPost });
});

app.post("/update-blog/:id", (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const blogPost = blogPosts.find(post => post.id === id);
    if (!blogPost) {
        return res.status(404).send('Blog post not found');
    }
    blogPost.title = title;
    blogPost.content = content;
    res.status(200).redirect("/");
});

app.post("/delete-blog/:id", (req, res) => {
    const { id } = req.params;
    const initialLength = blogPosts.length;
    blogPosts = blogPosts.filter(post => post.id !== id);
    if (blogPosts.length === initialLength) {
        return res.status(404).send('Blog post not found');
    }
    res.status(200).redirect("/");
});