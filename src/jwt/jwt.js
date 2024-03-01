import jwt  from "jsonwebtoken";
import SECRET_KEY from './secret.js'

const generateToken = (id, username, wallet, createdAt) => {
    const secretKey = SECRET_KEY

    const token = jwt.sign({id, username, wallet, createdAt}, secretKey, {expiresIn: '72h'})

    return token
}

export default generateToken