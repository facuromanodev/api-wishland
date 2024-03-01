import { spawn } from 'child_process';
import cwebp from 'cwebp-bin';

const conversionWebP = (req, res, next) => {
  if (!req.file) {
    return next(); // Si no se subió ningún archivo, pasa al siguiente middleware
  }

  const inputImagePath = req.file.path;
  const outputImagePath = inputImagePath + '.webp';

  const cwebpProcess = spawn(cwebp, [inputImagePath, '-o', outputImagePath]);

  cwebpProcess.on('close', (code) => {
    if (code === 0) {
      req.file.path = outputImagePath; // Cambia la ruta de la imagen a la versión WebP
      req.file.originalname += '.webp'; // Cambia el nombre del archivo a .webp
      req.file.mimetype = 'image/webp'; // Cambia el tipo MIME a image/webp
    }
    next();
  });
};

export default conversionWebP;
