import services from "../Services/wish.service.js";

const getAll = async (req, res) => {
  try {
    const allWishes = await services.getAll();
    res.status(200).send(allWishes);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

const getOne = async (req, res) => {
  try {
    const wishSelected = await services.getOne(req.params.id);
    res.status(200).send(wishSelected);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

const getByUser = async (req, res) => {
  try {
    const allWishes = await services.getByUser(req.params.username);
    res.status(200).send(allWishes);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

const create = async (req, res) => {
    if (req.body.title === ''){
      return res.status(400).send("El campo nombre es obligatorio")
    }
    try {
        const { title, price, userId } = req.body;
        const routeImg = req.file.path.replace(/\\/g, '/'); 
        const newWish = await services.create({
            title, 
            price, 
            userId,
            routeImg
        });
  
        res.status(200).send(newWish);
    } catch (err) {
        res.status(500).json(err.message);
    }
  }

  const update = async (req, res) => {
    if (req.body.nombre === ''){
      return res.status(400).send("El campo nombre es obligatorio")
    }
    try {
        const { title, price, userId, routeImg } = req.body;
        const wishData = {
          title, 
          price, 
          userId,
          routeImg
        };
  
        if (req.file) {
          wishData.routeImg = req.file.path.replace(/\\/g, '/'); 
        }
  
        const updatedWish = await services.update(req.params.id, wishData);
        res.status(200).send(updatedWish);
    } catch (err) {
        res.status(500).json(err.message);
    }
  }
  

const deleteOne = async (req, res) => {
  try {
    const wishToDelete = await services.deleteOne(req.params.id);
    res.status(200).send(wishToDelete);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export default {
  getAll,
  getOne,
  getByUser,
  create,
  update,
  deleteOne
}
