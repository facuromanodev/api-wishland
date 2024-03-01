import services from "../Services/user.service.js";

const getAll = async (req, res) => {
  try {
    const allUsers = await services.getAll();
    res.cookie('a', 'asd', {
      maxAge: 100000,
      sameSite: 'lax',
      httpOnly: true,
    })
    res.status(200).send(allUsers);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

const getOne = async (req, res) => {
  try {
    const userSelected = await services.getOne(req.params.username);
    res.status(200).send(userSelected);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

const login = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).json({ error: 'Se requieren nombre de usuario y contraseña.' });
      }
  
      const seleccionCliente = await services.login(username, password);
  
      if (seleccionCliente === 'Usuario o contraseña incorrectos') {
        return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
      }

      await res.cookie('user', JSON.stringify(seleccionCliente), {
        maxAge: 100000,
        httpOnly: true,
        secure: true,
        sameSite: 'lax'
      })
      await res.cookie('token', seleccionCliente.token, {
        maxAge: 100000,
        httpOnly: true,
        secure: true,
        sameSite: 'lax'
      })

      res.status(200).send(seleccionCliente);
    } catch (err) {
      res.status(500).json({ error: 'Ha ocurrido un error en el servidor.' });
    }
  };
  

const create = async (req, res) => {
  try {
    const newUser = await services.create(req.body);
    res.status(200).send(newUser);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

const update = async (req, res) => {
  try {
    const userData = await services.update(req.body, req.params.username);
    res.status(200).send(userData);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

const updateBannerPhoto = async (req, res) => {
  if (req.body.nombre === ''){
    return res.status(400).send("El campo nombre es obligatorio")
  }
  try {
    const { bannerImage } = req.body
    const dataUser = { bannerImage }

    if (req.file) {  
      dataUser.bannerImage = req.file.path.replace(/\\/g, '/'); 
    }

    const updatedUser = await services.updateBannerPhoto(dataUser, req.params.username);
    
    res.status(200).send(updatedUser);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

const updateProfilePhoto = async (req, res) => {
  if (req.body.nombre === ''){
    return res.status(400).send("El campo nombre es obligatorio")
  }
  try {
    const { profileImage } = req.body
    const dataUser = { profileImage }

    if (req.file) {  
      dataUser.profileImage = req.file.path.replace(/\\/g, '/'); 
    }

    const updatedUser = await services.updateProfilePhoto(dataUser, req.params.username);
    
    res.status(200).send(updatedUser);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

const updatePassword = async (req, res) => {
  try {
    const userData = await services.updatePassword(req.body, req.params.username);
    res.status(200).send(userData);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

const deleteOne = async (req, res) => {
  try {
    const adminToDelete = await services.deleteOne(req.params.username);
    res.status(200).send(adminToDelete);
  } catch (err) {
    res.status(500).json(err.message);
  }
}

export default {
  getAll,
  getOne,
  login,
  updateProfilePhoto,
  updateBannerPhoto,
  create,
  update,
  updatePassword,
  deleteOne
}
