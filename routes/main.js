const express = require('express');
const category = require('../models/category');
const router = express.Router();
const Post = require('../models/Post')
const User = require('../models/user')



router.get('/', (req, res) => {
    console.log(req.session)
    res.render('site/site')
})
router.get('/adana', (req, res) => {
    res.render('site/adana')
})
router.get('/antalya', (req, res) => {
    res.render('site/antalya')
})
router.get('/burdur', (req, res) => {
    res.render('site/burdur')
})
router.get('/hatay', (req, res) => {
    res.render('site/hatay')
})
router.get('/isparta', (req, res) => {
    res.render('site/ısparta')
})
router.get('/kahramanmaras', (req, res) => {
    res.render('site/kahramanmaraş')
})
router.get('/mersin', (req, res) => {
    res.render('site/mersin')
})
router.get('/osmaniye', (req, res) => {
    res.render('site/osmaniye')
})
router.get('/tarihce', (req, res) => {
    res.render('site/tarihce')
})
router.get('/kullanicitarifleri', (req, res) => {
    Post.find({}).populate({path:'author', model: User}).sort({$natural:-1}).lean().then(posts =>{
        category.aggregate([
            {
                $lookup:{
                    from: 'posts',
                    localField:'_id',
                    foreignField:'category',
                    as:'posts'
                }
            },
            {
                $project: {
                    _id:1,
                    name:1,
                    num_of_posts : {$size: '$posts'}
                }
            }
        ])
        .then(categories =>{
        res.render('site/kullanicitarifleri', {posts:posts, categories:categories})
        })
        
    })
})



module.exports = router