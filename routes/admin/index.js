const express = require('express');
const category = require('../../models/category');
const router = express.Router();
const Post = require('../../models/Post')
const path = require('path')



router.get('/', (req, res) => {

    res.render('admin/index')
})

router.get('/categories', (req, res) => {

    category.find({}).sort({$natural:-1}).lean().then(categories => {
        res.render('admin/categories', {categories:categories})
    })
})

router.post('/categories', (req, res) => {
    category.create(req.body, (error, category)=>{
        if(!error) {
            res.redirect('categories')
        }
    })
})

router.delete('/categories/:id', (req, res) => {
   category.remove({_id : req.params.id}).then(() => {
       res.redirect('/admin/categories')
   })
})

router.get('/posts', (req, res) => {

    
           Post.find({}).populate({path:'category', model: category}).sort({$natural:-1}).lean().then(posts =>{
        res.render('admin/posts', {posts:posts})
        })
})

router.delete('/posts/:id', (req, res) => {
    Post.remove({_id : req.params.id}).then(() => {
        res.redirect('/admin/posts')
    })
 })
 
 router.get('/posts/edit/:id', (req, res) => {
     Post.findOne({_id: req.params.id}).lean().then(post => {
         category.find({}).lean().then(categories => {
             res.render('admin/editpost' ,{post:post, categories:categories})
         })
     })
}) 

router.put('/posts/:id', (req, res) => {
    let post_image = req.files.post_image
    post_image.mv(path.resolve(__dirname, '../../public/resimler/postimages', post_image.name))
    Post.findOne({_id : req.params.id}).lean().then(post => {
        post.title = req.body.title
        post.content = req.body.content
        post.content2 = req.body.content2
        post.category = req.body.category
        post.date = req.body.date
        post.post_image =  `/resimler/postimages/${post_image.name}`
        
        var post = new Post(post);
        post.save().then(post =>{res.redirect('/admin/posts')})

    })
})

module.exports = router