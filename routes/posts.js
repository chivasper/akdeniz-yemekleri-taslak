const express = require('express');
const router = express.Router();
const Post = require('../models/Post')
const path = require('path');
const category = require('../models/category');
const user = require('../models/user');



router.get('/new', (req, res) => {
    if(!req.session.userId){
        return res.redirect('site/oturum')
    }
    category.find({}).lean().then(categories => {
        res.render('site/yemekyukle', {categories:categories})
    })
})

router.get('/category/:categoryId', (req,res) => {
    Post.find({category: req.params.categoryId}).populate({path:'category', model:category}).populate({path:'author', model: user}).lean().then(posts => {
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
        ]).then(categories => {
            res.render('site/kullanicitarifleri', {posts:posts, categories:categories})
        })
    })
})


router.post('/test', (req, res) => {

    let post_image = req.files.post_image

    post_image.mv(path.resolve(__dirname, '../public/resimler/postimages',post_image.name))
    
    Post.create({
        ...req.body,
        post_image: `/resimler/postimages/${post_image.name}`,
        author : req.session.userId
    }, )

    req.session.sessionFlash = {
        type: 'alert alert-success',
        message: 'Yemeğiniz Paylaşılmıştır.'
    }
    res.redirect('/kullanicitarifleri')   
})

module.exports = router