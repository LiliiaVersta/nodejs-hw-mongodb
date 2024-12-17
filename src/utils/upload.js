import multer from 'multer';

const storage = multer.memoryStorage(); //в памяти
export const upload = multer({ storage });
