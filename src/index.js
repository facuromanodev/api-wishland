import express from "express";
import cors from 'cors'
import compression from 'compression'

import userRoutes from './Routes/user.routes.js'
import wishRoutes from './Routes/wish.routes.js'
import paymentRoutes from './Routes/payment.routes.js'

import { PORT } from './config.js'

const app = express()

app.use( express.json() )
app.use(compression())
app.use(cors({ origin: '*' }));

app.use("/api", userRoutes)
app.use("/api", wishRoutes)
app.use("/api", paymentRoutes)
app.use('/opt/render/project/src/uploads', express.static('uploads'));
app.use('/uploads', express.static('uploads'));

app.listen(PORT);

console.log('✅' + ' Congrats, the running ok!\n')
console.log('🌎' + ` URL: http://localhost:${ PORT}\n`)
console.log('📡 Port: ' + PORT)