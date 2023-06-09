import { AddAccountUsecase } from '@/domain/usecases/account/add-account-usecase';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import { AccountMongoRepository } from '@/infra/database/mongodb/repositories/account/account-mongo-repository';
import app from '@/main/config/app';
import env from '@/main/config/env';
import { hash } from 'bcrypt';
import * as request from 'supertest';

async function makeAddAccountModel(): Promise<AddAccountUsecase.Params> {
  const password = await hash('any-password', 12);
  return {
    name: 'any-name',
    email: 'any-email@mail.com',
    password,
  };
}

function makeAccountMongoRepository(): AccountMongoRepository {
  return new AccountMongoRepository();
}

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.instance.connect(env.mongoUrl);
  });

  afterAll(async () => {
    await MongoHelper.instance.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.instance.getCollection(
      'accounts',
    );
    await accountCollection.deleteMany({});
  });

  describe('POST /signup', () => {
    it('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any-name',
          email: 'any-email@mail.com',
          password: 'any-password',
          passwordConfirmation: 'any-password',
        })
        .expect(200);
    });
  });

  describe('POST /login', () => {
    it('Should return 200 on login', async () => {
      const mongoRepository = makeAccountMongoRepository();
      const fakeAccount = await makeAddAccountModel();
      await mongoRepository.add(fakeAccount);

      await request(app)
        .post('/api/login')
        .send({
          email: 'any-email@mail.com',
          password: 'any-password',
        })
        .expect(200);
    });

    it('Should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'any-email@mail.com',
          password: 'any-password',
        })
        .expect(401);
    });
  });
});
