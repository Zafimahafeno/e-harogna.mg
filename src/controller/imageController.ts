import { Request, Response } from "express";
import multer from "multer";
import path, { extname } from "path";
import { getManager } from "typeorm";
import { harognaFile } from "../entity/file.entity";
import fs from 'fs';

const uploadImage = multer({
  dest: "./upload/images",
  fileFilter: function (req, file, callback) {
    let ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.JPG') {
      return callback(new Error('Only images are allowed'))
    }
    callback(null, true);
  }
}).single('imagefile');

const uploadVideo = multer({
  dest: "./upload/videos",
  fileFilter: function (req, file, callback) {
    let ext = path.extname(file.originalname);
    if (ext !== '.mp4' && ext !== '.avi' && ext !== '.mov' && ext !== '.mkv') {
      return callback(new Error('Only videos are allowed'))
    }
    callback(null, true);
  }
}).single('videofile');

export const UploadFile = async (req: Request, res: Response, next: Function) => {
  uploadImage(req, res, async (err) => {
    if (err) {
      return res.status(400).send(err);
    }

    req.body['imgUrl'] = `/api/uploads/images/${req.file.filename}`;

    const fileRepository = getManager().getRepository(harognaFile);
    try {
      await fileRepository.save({
        filename: req.file.filename,
        path: '/api/uploads/images/',
        ext: path.extname(req.file.filename),
        user: {
          id: req.session['uId'].id
        }
      });
    } catch (error) {
      console.log(error);
    }
    next();
  });
};

export const UploadFileJob = async (req: Request, res: Response, next: Function) => {
  uploadImage(req, res, async (err) => {
    if (err) {
      return res.status(400).send(err);
    }

    req.body['imgUrl'] = `/api/uploads/jobs/${req.file.filename}`;

    const fileRepository = getManager().getRepository(harognaFile);
    try {
      await fileRepository.save({
        filename: req.file.filename,
        path: '/api/uploads/jobs',
        ext: path.extname(req.file.filename),
        user: {
          id: req.session['uId'].id
        }
      });
    } catch (error) {
      console.log(error);
    }
    next();
  });
};

export const UploadImage = async (req: Request, res: Response, next: Function) => {
  uploadImage(req, res, async (err) => {
    if (err) {
      return res.status(400).send(err)
    }

    const fileRepository = getManager().getRepository(harognaFile);
    try {
      await fileRepository.save({
        filename: req.file.filename,
        path: '/api/uploads/images/',
        ext: path.extname(req.file.filename),
        user: {
          id: req.session['uId'].id
        }
      });
    } catch (error) {
      console.log(error);
    }

    return res.send({
      url: `/api/uploads/images/${req.file.filename}`,
      fileName: req.file.filename,
      uploaded: 1,
    });
  });
};

export const UploadVideo = async (req: Request, res: Response, next: Function) => {
  uploadVideo(req, res, async (err) => {
    if (err) {
      return res.status(400).send(err);
    }

    req.body['videoUrl'] = `/api/uploads/videos/${req.file.filename}`;

    const fileRepository = getManager().getRepository(harognaFile);
    try {
      await fileRepository.save({
        filename: req.file.filename,
        path: '/api/uploads/videos',
        ext: path.extname(req.file.filename),
        user: {
          id: req.session['uId'].id
        }
      });
    } catch (error) {
      console.log(error);
    }
    next();
  });
};

export const fetchAllfile = async (req: Request, res: Response) => {
  const take = 10;
  const page = (parseInt(req.query.page as string || '1') < 0) ? 1 : parseInt(req.query.page as string || '1');
  const repository = getManager().getRepository(harognaFile);
  await repository.findAndCount({
    take,
    skip: (page - 1) * take,
  }).then((result) => {
    const [data, total] = result;
    return res.status(200).render('CourseItems/index', {
      data,
      page_name: "liste3",
      title: 'Fichier',
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take)
      }
    });
  }).catch((err) => {
    return res.status(500).send(err);
  });
};
