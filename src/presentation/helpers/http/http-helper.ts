import { ServerError } from '@/presentation/errors/server-error';
import { UnauthorizedError } from '@/presentation/errors/unauthorized-error';
import { HttpResponse } from '@/presentation/protocols/http';

export function badRequest(error: Error): HttpResponse {
  return {
    statusCode: 400,
    body: error,
  };
}

export function forbidden(error: Error): HttpResponse {
  return {
    statusCode: 403,
    body: error,
  };
}

export function unauthorized(): HttpResponse {
  return {
    statusCode: 401,
    body: new UnauthorizedError(),
  };
}

export function serverError(error: Error): HttpResponse {
  return {
    statusCode: 500,
    body: new ServerError(error.stack),
  };
}

export function ok(data: { [key: string]: any }): HttpResponse {
  return {
    statusCode: 200,
    body: data,
  };
}

export function noContent(): HttpResponse {
  return {
    statusCode: 204,
    body: null,
  };
}

export function created(data?: { [key: string]: any }): HttpResponse {
  return {
    statusCode: 201,
    body: data,
  };
}
