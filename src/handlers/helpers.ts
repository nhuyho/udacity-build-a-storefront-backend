import jwt, { Secret } from 'jsonwebtoken';
import { User } from '../models/user';
import { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.TOKEN_KEY as Secret;

export function getTokenByUser(user: User) {
  return jwt.sign({ user }, SECRET);
}

export const verifyToken = (req: Request, res: Response, next) => {
  if (!req.body.token) {
    res.status(403).json({ error: 'No credentials sent!' });
    return false;
  }
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    console.log(token);
    jwt.verify(token, SECRET);
    next();
  } catch (error) {
    res.status(401);
    res.json('Access denied, invalid token');
    return;
  }
};
