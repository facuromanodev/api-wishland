import { prisma } from "../db.js";

const getAll = async () => {
    try {
        const allWishes = await prisma.wish.findMany()
        return(allWishes)
    }
    catch (err) {
        return(err.message);
    }
}

const getByUser = async (_username) => {
    try {
      const user = await prisma.user.findFirst({
        where: {
            username: _username
        }
      })

      if(user) {
        const userWishes = await prisma.wish.findMany({
          where: {
              userId: parseInt(user.id)
          }
      })
      return(userWishes)
      }
    }
    catch (err) {
        return(err.message);
    }
}

const getOne = async (_id) => {
    try {
        const wishSelected = await prisma.wish.findFirst({
            where:{
                id: parseInt(_id)
            }
        })

        return wishSelected
    }
    catch (err) {
        return(err.message);
    }
}

const create = async (_newWish) => {
  const a = _newWish.title
  if (a.length < 3) {
    throw new Error('The title must be longer than 3 characters')
  }
  try {
    const newWish = await prisma.wish.create({
      data: {
        title: _newWish.title,
        routeImg: _newWish.routeImg,
        price: _newWish.price,
        userId: parseInt(_newWish.userId),
      }
    });

    return newWish;
  } catch (err) {
    throw new Error(err.message);
  }
}
const update = async (_id, _dataWish) => {
  try {
      const { routeImg, title, price, userId } = _dataWish;

      const dataToUpdate = {
        routeImg,
        price,
        title,
        userId: parseInt(userId)
      };

      if (routeImg) {
          dataToUpdate.routeImg = `${routeImg}`;
      }

      const updatedWish = await prisma.wish.update({
          where: {
              id: parseInt(_id)
          },
          data: dataToUpdate
      });

      return updatedWish;
  } catch (err) {
      console.error(err);
      return err.message;
  }
}


const deleteOne = async (_id) => {
  try {
    const wishToDelete = await prisma.wish.delete({
        where:{
            id: parseInt(_id)
        }
    });

    return wishToDelete;
  } catch (err) {
    throw new Error(err.message);
  }
}


export default {
    getAll,
    getByUser,
    getOne,
    create,
    update,
    deleteOne
}