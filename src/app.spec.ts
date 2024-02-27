import request from 'supertest';
import {describe, it} from "vitest";

import app from './app';

describe('app', () => {
  it('responds with a not found message', () => {
    request(app)
      .get('/random')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404);
  });

  it('responds with 200 status code', () => {
    request(app)
      .get('/messages')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
  });
});