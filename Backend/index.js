import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'


dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './Config/connectDB.js'
import userRouter from './Routes/userRoute.js'

const app = express()

app.use(cors({
    credentials: true,
    origin : 'http://localhost:3000'
}))



app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet(
    {
        crossOriginResourcePolicy: false,
    }
))

const PORT = 8000 || process.env.PORT

app.use('/api/user', userRouter)
app.get('/', (req, res) => {
    res.send({
        message: "server is running"
})
})


// app.use('/api/user',userRouter)

connectDB().then(() => {
    app.listen(PORT , ()=> {
    console.log(`server is running on port ${PORT}`)
})
})