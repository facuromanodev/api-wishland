import bcrypt from 'bcrypt'

import { prisma } from "../db.js";
import  generateToken from "../jwt/jwt.js"

function exclude(user, keys) {
    return Object.fromEntries(
      Object.entries(user).filter(([key]) => !keys.includes(key))
    );
  }

const getAll = async () => {
    try {
        const allUsers = await prisma.user.findMany()
        return(allUsers)
    }
    catch (err) {
        return(err.message);
    }
}

const getOne = async (_username) => {
    try {
        const userSelected = await prisma.user.findFirst({
            where:{
                username: _username
            }
        })

        const userToReturn = exclude(userSelected, ['password', 'id', 'createdAt', 'wallet', 'tel'])
        return userToReturn
    }
    catch (err) {
        return(err.message);
    }
}

const login = async (_username, _password) => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username: _username,
        }
      });
  
      if (!user) {
        return "Usuario o contraseña incorrectos";
      }
  
      const passwordMatch = await bcrypt.compare(_password, user.password);
      
      if (passwordMatch) {
        const userWithoutSensitiveInfo = exclude(user, ['createdAt', 'password']);
        const token = generateToken(user.id, user.username, user.wallet, user.acceptedTermsAndConditions);
        return { ...userWithoutSensitiveInfo, token };
      } else {
        return "Usuario o contraseña incorrectos";
      }
    } catch (err) {
      return err.message;
    }
  };

const create = async (_newUser) => {
  try {
    const hashedPassword = await bcrypt.hash(_newUser.password, 10); // El segundo parámetro es el costo del hash

    const newUser = await prisma.user.create({
      data: {
        username: _newUser.username,
        password: hashedPassword,
        name: _newUser.name,
        lastName: _newUser.lastName,
        tel: _newUser.tel,
        email: _newUser.email,
        wallet: _newUser.wallet,
        acceptedTermsAndConditions: _newUser.terms === true ? 1 : 0,
        createdAt: _newUser.createdAt,
      }
    });

    const userToReturn = exclude(newUser, ['password', 'id'])
    return userToReturn;
  } catch (err) {
    throw new Error(err.message);
  }
}

const update = async (_dataUser, _username) => {
  try {
    const hashedPassword = await bcrypt.hash(_dataUser.password, 10); // El segundo parámetro es el costo del hash

    const dataUser = await prisma.user.update({
        where: {
            username: _username
        },
        data: {
            username: _dataUser.username,
            password: hashedPassword,
            name: _dataUser.name,
            lastName: _dataUser.lastName,
            tel: _dataUser.tel,
            email: _dataUser.email,
            wallet: _dataUser.wallet,
            createdAt: _dataUser.createdAt,
        }
    });

    const newUserToReturn = exclude(dataUser, ['password', 'id'])
    return newUserToReturn;
  } catch (err) {
    throw new Error(err.message);
  }
}
const updateProfilePhoto = async (_dataUser, _username) => {
  try {

    const { profileImage } = _dataUser
    const dataToUpdate = {profileImage};

    if (profileImage) { dataToUpdate.profileImage = `${profileImage}`}

    const updatedUser = await prisma.user.update({
      where: { username: _username },
      data: dataToUpdate
    });

  return updatedUser;
  
} catch (err) {
    throw new Error(err.message);
  }
}
const updateBannerPhoto = async (_dataUser, _username) => {
  try {

    const {  bannerImage } = _dataUser
    const dataToUpdate = { bannerImage};

    if (bannerImage) { dataToUpdate.bannerImage = `${bannerImage}` }

    const updatedUser = await prisma.user.update({
      where: { username: _username },
      data: {
        bannerImage: dataToUpdate
      }
    });

  return updatedUser;
  
} catch (err) {
    throw new Error(err.message);
  }
}
const updatePassword = async (_dataUser, _username) => {
  try {
    const newHashedPassword = await bcrypt.hash(_dataUser.newPassword, 10); // New password to update
    
    const dataUser = await prisma.user.update({
        where: {
            username: _username,
        },
        data: {
            password: newHashedPassword,
        }
    });

    const newUserToReturn = exclude(dataUser, ['password', 'id'])
    return newUserToReturn;
  } catch (err) {
    throw new Error(err.message);
  }
}

const deleteOne = async (_username) => {
  try {
    const adminDeleted = await prisma.user.delete({
        where:{
            username: _username
        }
    });

    return adminDeleted;
  } catch (err) {
    throw new Error(err.message);
  }
}


export default {
    getAll,
    getOne,
    login,
    create,
    update,
    updateProfilePhoto,
    updateBannerPhoto,
    updatePassword,
    deleteOne
}