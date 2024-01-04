
import { Router } from "express"
import { Server } from 'socket.io'

const router = Router()

router.get('/chat', (req, res) => {
    res.render('chat', {})
})

export default router