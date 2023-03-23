import { LogErrorRepository } from '@/data/protocols/database/log/log-error-repository';
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator';
import { ok, serverError } from '@/presentation/helpers/http/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';

type SutTypes = {
  sut: Controller;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
};

function makeFakeRequest(): HttpRequest {
  return {
    body: {
      name: 'any-name',
      email: 'any-email',
      password: 'any-password',
      passwordConfirmation: 'any-password',
    },
  };
}

function makeFakeResponse(): HttpRequest {
  return {
    body: {
      name: 'any-name',
      email: 'any-email',
      password: 'any-password',
    },
  };
}

async function makeFakeServerError(): Promise<HttpResponse> {
  const fakeError = new Error();
  fakeError.stack = 'any-stack';
  return serverError(fakeError);
}

function makeController(): Controller {
  class ControllerStub implements Controller {
    async handle(): Promise<HttpResponse> {
      return ok(makeFakeResponse());
    }
  }

  return new ControllerStub();
}

function makeLogErrorRepository(): LogErrorRepository {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(): Promise<void> {
      return;
    }
  }

  return new LogErrorRepositoryStub();
}

function makeSut(): SutTypes {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub,
  );

  return { sut, controllerStub, logErrorRepositoryStub };
}

describe('Log Controller Decorator', () => {
  it('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    await sut.handle(makeFakeRequest());

    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
  });

  it('should return the same return the controller', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(ok(makeFakeResponse()));
  });

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');

    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(makeFakeServerError());

    await sut.handle(makeFakeRequest());

    expect(logSpy).toHaveBeenCalledWith('any-stack');
  });
});
