import { Request } from 'express';

export type OnError = <T extends ErrorHandler>(p: T) => T;

export type ErrorHandler = (p: {
  error: { status: number; data?: any; name: string };
  path: string;
  req: Request;
  mdlwData?: Record<any, any>;
  headers?: Record<string, string>;
  body?: Record<any, any>;
  query?: Record<any, any>;
}) => void;
