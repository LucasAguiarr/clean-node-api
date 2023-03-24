import { Controller } from '@/presentation/protocols/controller';
import { HttpRequest } from '@/presentation/protocols/http';
import { Request, Response } from 'express';

type ExpressReturn = {
  (request: Request, response: Response): Promise<void>;
};

export function ExpressRouteAdapter(controller: Controller): ExpressReturn {
  return async (request: Request, response: Response): Promise<void> => {
    const httpRequest: HttpRequest = {
      body: request?.body,
      params: request?.params,
      accountId: request?.accountId,
    };

    const httpResponse = await controller.handle(httpRequest);
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      response.status(httpResponse.statusCode).json(httpResponse.body);
    } else {
      response.status(httpResponse.statusCode).json({
        message: httpResponse.body.message,
      });
    }
  };
}
