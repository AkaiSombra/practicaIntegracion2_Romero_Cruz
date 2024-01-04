
import { Router } from "express"
import passport from 'passport'

import userModel from "../models/users.models.js"
import { createHash, isValidPassword } from '../utils.js'
import initPassport from "../config/passport.config.js"

initPassport()

const router = Router()


// Register
router.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/failregister', failureMessage: true}), async (req, res) => {
    try{
        res.status(200).send({ status: 'OK', data: `User registered`} )
    } catch(err){
        res.status(400).send({ status: 'ERROR', data: err.message})
    }
})

router.get('/failregister', async (req, res) => {
    // const errorMessage = req.flash('error')[0]
    console.log(req.flash)
    res.status(400).send({ status: 'ERROR', data: 'Email or username already exist'})
})


// Restore password
router.post('/restorepassword', passport.authenticate('restorepassword', { failureRedirect: '/api/sessions/failrestore'}), async (req, res) => {
    try{
        res.status(200).send({ status: 'OK', data: `Password changed`} )
    } catch(err){
        res.status(400).send({ status: 'ERROR', data: err.message})
    }
})

router.get('/failrestore', async (req, res) => {
    res.status(400).send({ status: 'ERROR', data: 'Username are not correct'})
})

// Login
router.post('/login', async (req, res) => {
    try{
        const { username, password} = req.body

        const searchUserBaseData = await userModel.findOne({ username: username}).lean()
        
        if (username === searchUserBaseData.username && isValidPassword(searchUserBaseData, password)){
            if(username === 'Sombra'){
                req.session.user = { username: username, firstName: searchUserBaseData.firstName, lastName: searchUserBaseData.lastName, role: searchUserBaseData.role, image: '/static/image/KurumiSombra.jpg'}
                res.status(200).send({ Status: 'OK', data: 'User loged'})
            } else {
                req.session.user = { username: username, firstName: searchUserBaseData.firstName, lastName: searchUserBaseData.lastName, role: searchUserBaseData.role}
                res.status(200).send({ Status: 'OK', data: 'User loged'})
            }
        } else {
            res.status(401).send({ status: 'ERROR', data: 'Username or Password are incorrect'})
        }

    } catch(err){
        res.status(500).send({ status: 'ERROR', data: err.message})
    }
})

// Github Login
router.get('/github', passport.authenticate('github', { scope: ['user: email'] }), async (req, res) => {
})

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = { username: req.user.username, firstName: req.user.firstName, lastName: req.user.lastName, role: req.user.role}
    res.redirect('/products')
})

// Google Login
router.get('/google', passport.authenticate('google', { scope: [ 'profile', 'email'] }), async (req, res) => {
})

router.get('/googlecallback', passport.authenticate('google', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = { username: req.user.username, firstName: req.user.firstName, lastName: req.user.lastName, role: req.user.role}
    res.redirect('/products')
})

router.get('/current', (req, res) => {
    try{
        if (req.session.user){
            res.status(200).send({ status: 'OK', data: req.session.user})
        } else {
            res.status(200).send({ status: 'OK', data: 'No user data'})
        }
    } catch(err){
        res.status(500).send({ status: 'ERROR', data: err.message})
    }
})

router.get('/logout', async (req, res) => {
    try{
        req.session.destroy((err) => {
            if (err){
                res.status(500).send({ status: 'ERROR', data: err.message})
            } else{
                // res.status(200).send({ status: 'OK', data: `Session finalizada`})
                res.redirect('/login')
            }
        })
        
    } catch(err){
        res.status(500).send({ status: 'ERROR', data: err.message})
    }
})

export default router