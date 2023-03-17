import { LoginController } from '@/presentation/controllers/login/login-controller';
import { MissingParamError } from '@/presentation/errors/missing-param-error';
import { badRequest } from '@/presentation/helpers/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import { HttpRequest } from '@/presentation/protocols/http';

interface SutTypes {
  sut: Controller;
}

function makePostFake(): HttpRequest {
  return {
    body: {
      email: 'any-email',
      password: 'any-password',
    },
  };
}

function makeSut(): SutTypes {
  const sut = new LoginController();

  return { sut };
}

describe('Login Controller', () => {
  it('Should return 400 if no email is provider', async () => {
    const { sut } = makeSut();
    const httRequest = makePostFake();
    delete httRequest.body.email;
    const httpResponse = await sut.handle(httRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('Should return 400 if no password is provider', async () => {
    const { sut } = makeSut();
    const httRequest = makePostFake();
    delete httRequest.body.password;
    const httpResponse = await sut.handle(httRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });
});
