import request from 'supertest';
import express from 'express';
import {vi, describe, it, expect} from "vitest";
import router from './controller';
import * as template from './repository';

vi.mock('./repository');

const app = express();
app.use(express.json());
app.use('/', router);

describe('Template Controller', () => {
  describe('GET /', () => {
    it('should return all templates', async () => {
      const mockTemplates = [{ id: 1, message: 'Test Message' }];
      template.getAll.mockResolvedValue(mockTemplates);
      
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTemplates);
    });
  });

  describe('GET /:id', () => {
    it('should return a template by id', async () => {
      const mockId = 1;
      const mockTemplate = { id: mockId, message: 'Test Message' };
      template.getById.mockResolvedValue(mockTemplate);
      
      const response = await request(app).get(`/${mockId}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTemplate);
    });

    it('should return 404 if template is not found', async () => {
      const mockId = 999;
      template.getById.mockResolvedValue(undefined);
      
      const response = await request(app).get(`/${mockId}`);
      
      expect(response.status).toBe(404);
      expect(response.body).toEqual('Template not found');
    });
  });

  describe('POST /', () => {

    it('should return 422 if validation fails', async () => {
      const mockTemplate = { message: '' }; // Invalid message
      const expectedErrorMessage = 'Missing congratulation message';
      template.create.mockRejectedValue(new Error('Mock Validation Error'));

      const response = await request(app)
        .post('/')
        .send(mockTemplate);

      expect(response.status).toBe(422);
      expect(response.body).toEqual(expectedErrorMessage);
    });
  });

  describe('PATCH /:id', () => {
    it('should update a template', async () => {
      const mockId = 1;
      const mockPartial = { message: 'Updated Test Message' };
      const mockUpdatedTemplate = { id: mockId, message: mockPartial };
      template.update.mockResolvedValue(mockUpdatedTemplate);

      const response = await request(app)
        .patch(`/${mockId}`)
        .send(mockPartial);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedTemplate);
    });

    it('should return 404 if template is not found', async () => {
      const mockId = 999;
      const mockPartial = { message: 'Updated Test Message' };
      template.update.mockResolvedValue(undefined);

      const response = await request(app)
        .patch(`/${mockId}`)
        .send(mockPartial);

      expect(response.status).toBe(404);
      expect(response.body).toEqual('Template not found');
    });
  });

  describe('DELETE /:id', () => {
    it('should delete a template', async () => {
      const mockId = 1;
      template.getById.mockResolvedValue({ id: mockId, message: 'Test Message' });
      template.deleteRow.mockResolvedValue({ affectedRowCount: 1 });

      const response = await request(app).delete(`/${mockId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual('Template was deleted');
    });

    it('should return 400 if template is not found', async () => {
      const mockId = 999;
      template.getById.mockResolvedValue(undefined);

      const response = await request(app).delete(`/${mockId}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual(`Template by id ${mockId} not found`);
    });
  });
});