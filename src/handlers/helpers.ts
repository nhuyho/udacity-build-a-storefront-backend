import jwt, { Secret } from 'jsonwebtoken';
import { User } from '../models/user';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.TOKEN_KEY as Secret;

export const getTokenByUser = (user: User) => {
  return jwt.sign({ user }, SECRET);
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    res.status(403).json({ error: 'No credentials sent!' });
    return false;
  }
  try {
    const authHead: string | undefined = req.headers.authorization;
    const token: string = authHead ? authHead.split(' ')[1] : '';
    const decoded: string | object = jwt.verify(token, SECRET as string);
    res.locals.userData = decoded;
    next();
  } catch (error) {
    res.status(401);
    res.json('Access denied, invalid token');
    return;
  }
};
