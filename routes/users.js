const express = require('express');
const router = express.Router();
const User = require('../models/user')

router.get('/register', (req, res) => {
    res.render('site/kaydol')
})

router.post('/register', (req, res) => {
    User.create({
        ...req.body,
        
      },  )
      req.session.sessionFlash = {
        type: 'alert alert-success',
        message: 'Kullanıcı oluşturuldu.'
    }

      res.redirect('/users/login')
})

router.get('/login', (req, res) => {
    res.render('site/oturum')
})

router.post('/login', (req, res) => {
    const {email,password} = req.body

    User.findOne({email}, (error, user)=>{
        if (user) {
            if (user.password == password) {
                req.session.userId = user._id
                res.redirect('/')
            } 
            else {
                res.redirect('/users/login')
            }
        }
        else {
            res.redirect('/users/register')
        }
    })
})

router.get('/logout', (req, res) => {
    req.session.destroy(()=> {
        res.redirect('/')
    })
})

module.exports = router