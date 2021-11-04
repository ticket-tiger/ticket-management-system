import express from 'express'

const router = express.Router()

router.get('/get-tickets', (req, res) => {
    console.log("Received GET request.")
    res.end()
})

router.post('/create-ticket', (req, res) => {
    console.log("Received POST request.")
})

export default router