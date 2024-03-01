import jwt from 'jsonwebtoken';
import SECRET_KEY from './secret.js'

const authRequired = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.sendStatus(401); 
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    if(decoded.esAdmin === 1){
      next();
    }else{
      return res.sendStatus(401); 
    }
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.sendStatus(403); 
  }
};

export default authRequired;
      