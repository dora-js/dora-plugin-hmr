import dora from 'dora';
import { join } from 'path';
import request from 'supertest';

const port = '12347';

describe('index', () => {

  const cwd = process.cwd();

  before(done => {
    process.chdir(join(__dirname, './fixtures/normal'));
    dora({
      port,
      plugins: ['dora-plugin-atool-build', '../../../src/index'],
      cwd: join(__dirname, './fixtures/normal'),
    });
    setTimeout(done, 1000);
  });

  after(() => {
    process.chdir(cwd);
  });

  it('GET /package.json', done => {
    request(`http://localhost:${port}`)
      .get('/package.json')
      .expect(/\.\/index\.js/, done);
  });
});

