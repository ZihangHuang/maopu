import request from 'supertest';
import app from '../src/server';

describe('POST /authentication', () => {
  test('should return 200 0K', () => {
    return request(app)
      .post('/authentication')
      .expect(200);
  });

  test('should return not logined when do not send authorization', done => {
    request(app)
      .post('/authentication')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.text).toBe(
          JSON.stringify({ code: -1, msg: '未登录', data: {} }),
        );

        done();
      });
  });

  test('should return logined when send valid authorization', done => {
    request(app)
      .post('/login')
      .send({
        username: 'admin',
        password: '123456',
      })
      .end((err, res) => {
        if (err) return done(err);

        const json = JSON.parse(res.text);
        expect(json.code).toBe(1);

        request(app)
          .post('/authentication')
          .set('Authorization', 'Bearer ' + json.data.token)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);

            expect(res.text).toBe(
              JSON.stringify({ code: 1, msg: '验证成功', data: {} }),
            );

            done();
          });
      });
  });
});
