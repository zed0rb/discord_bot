import request from 'supertest';
import express from 'express';
import {vi, describe, it, expect, beforeEach} from "vitest";
import router from './controller';
import * as sprint from './repository';

vi.mock('./repository');

const app = express();
app.use(express.json());
app.use('/', router);

describe('Sprint Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /', () => {
    it('should return all sprints', async () => {
      const mockSprints = [{ id: 1, sprintCode: 'SPR001', title: 'Sprint 1' }];
      sprint.getAllSprints.mockResolvedValue(mockSprints);

      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSprints);
    });
  });

  describe('POST /', () => {
    it('should create a new sprint', async () => {
      const mockSprint = { sprintCode: 'SPR001', title: 'Sprint 1' };
      sprint.create.mockResolvedValue({ id: 1, ...mockSprint });

      const response = await request(app)
        .post('/')
        .send(mockSprint);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(`Sprint was created with sprint code: ${mockSprint.sprintCode} and title: ${mockSprint.title}`);
    });

    it('should return 422 if validation fails', async () => {
      const mockSprint = { sprintCode: '', title: 'Sprint 1' }; // Invalid sprintCode
      const expectedErrorMessage = 'Missing sprintCode or title message';
      sprint.create.mockRejectedValue(new Error('Mock Validation Error'));

      const response = await request(app)
        .post('/')
        .send(mockSprint);

      expect(response.status).toBe(422);
      expect(response.body).toEqual(expectedErrorMessage);
    });
  });

  describe('GET /:id', () => {
    it('should return a sprint by id', async () => {
      const mockId = 1;
      const mockSprint = { id: mockId, sprintCode: 'SPR001', title: 'Sprint 1' };
      sprint.getById.mockResolvedValue(mockSprint);

      const response = await request(app).get(`/${mockId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSprint);
    });

    it('should return 404 if sprint is not found', async () => {
      const mockId = 999;
      sprint.getById.mockResolvedValue(undefined);

      const response = await request(app).get(`/${mockId}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual(`No sprint in database with id: ${mockId}`);
    });
  });

  describe('PATCH /:id', () => {
    it('should update a sprint', async () => {
      const mockId = 1;
      const mockPartial = { title: 'Updated Sprint Title' };
      const mockUpdatedSprint = { id: mockId, sprintCode: 'SPR001', title: 'Updated Sprint Title' };
      sprint.update.mockResolvedValue(mockUpdatedSprint);

      const response = await request(app)
        .patch(`/${mockId}`)
        .send(mockPartial);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedSprint);
    });

    it('should return 404 if sprint is not found', async () => {
      const mockId = 999;
      const mockPartial = { title: 'Updated Sprint Title' };
      sprint.update.mockResolvedValue(undefined);

      const response = await request(app)
        .patch(`/${mockId}`)
        .send(mockPartial);

      expect(response.status).toBe(404);
      expect(response.body).toEqual('Sprint not found');
    });
  });

  describe('DELETE /:id', () => {
    it('should delete a sprint', async () => {
      const mockId = 1;
      sprint.getById.mockResolvedValue({ id: mockId, sprintCode: 'SPR001', title: 'Sprint 1' });
      sprint.deleteRow.mockResolvedValue({ affectedRowCount: 1 });

      const response = await request(app).delete(`/${mockId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual('Sprint was deleted');
    });

    it('should return 400 if sprint is not found', async () => {
      const mockId = 999;
      sprint.getById.mockResolvedValue(undefined);

      const response = await request(app).delete(`/${mockId}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual(`Sprint by id ${mockId} not found`);
    });
  });
});
