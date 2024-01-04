
import passport from 'passport'
import LocalStrategy from 'passport-local'
import GithubStrategy from 'passport-github2'
import GoogleStrategy from 'passport-google-oauth20'
import userModel from '../models/users.models.js'
import { createHash, isValidPassword } from '../utils.js'

const initPassport = () => {
    const verifyRegistration = async (req, username, password, done) => {
        try {

            const user = req.body

            const userInDb = await userModel.findOne({ $or: [{ username: user.username }, { email: user.email }]})
            
            if (userInDb) return done(null, false)
            if (userInDb.email === user.email) return done(`ERROR`, false)

            user.password = createHash(user.password)

            const process = await userModel.create(user)

            return done(null, process)
        } catch (err) {
            return done(`Error passport local: ${err.message}`)
        }
    }

    const verifyRestoration = async (req, username, password, done) => {
        try {

            const restoreData = req.body

            if (restoreData.username.length === 0 || restoreData.newPassword.length === 0) {
                return done('Username and new password are required', false)
            }

            const user = await userModel.findOne({ username: restoreData.username})

            if (!user) return done(null, false)

            const process = await userModel.findOneAndUpdate({ username: restoreData.username }, { password: createHash(restoreData.newPassword) })

            return done(null, process)
  
        } catch (err) {
            return done(`Error passport local: ${err.message}`)
        }
    }

    const verifyGithub = async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await userModel.findOne({ $or: [{ email: profile._json.email}, { username: profile.username}]})

            if (!user) {
                const name_parts = profile._json.name.split(' ')
                const newUser = {
                    firstName: name_parts[0],
                    lastName: name_parts[1],
                    email: profile._json.email || ' ',
                    username: profile.username,
                    password: ' '
                }
    
                const process = await userModel.create(newUser)
    
                return done(null, process)
            } else {
                done(null, user)
            }
        } catch (err) {
            return done(`Error passport Github: ${err.message}`)
        }
    }

    const verifyGoogle = async (accessToken, refreshToken, profile,  done) => {
        try {

            //return done(null, profile)

            const user = await userModel.findOne({ $or: [{ email: profile._json.email}, { username: profile.id}]})

             if (!user) {
                const newUser = {
                    firstName: profile._json.given_name,
                    lastName: profile._json.family_name,
                    email: profile._json.email || ' ',
                    username: profile.id,
                    password: ' '
                }
    
                const process = await userModel.create(newUser)
    
                return done(null, process)
            } else {
                done(null, user)
            }
        } catch (err) {
            return done(`Error passport Google: ${err.message}`)
        }
    }

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.fe5fdbed3cdf6357',
        clientSecret: '072a2fbefe976d5eec48809b9d7d3c6ee160f0ef',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, verifyGithub))

    passport.use('google', new GoogleStrategy({
        clientID: '936602164183-can082rd050el32nt07iia9ctuq1evit.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:8080/api/sessions/googlecallback'
    }, verifyGoogle))
    
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'username',
        passwordField: 'password'
    }, verifyRegistration))

   passport.use('restorepassword', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'username',
        passwordField: 'newPassword'
    },  verifyRestoration))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
        
    passport.deserializeUser(async (id, done) => {
        try {
            done(null, await userModel.findById(id))
        } catch (err) {
            done(err.message)
        }
    })
}

export default initPassport