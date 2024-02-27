import request from 'supertest';
import express from 'express';
import {vi, describe, it, expect, beforeEach} from "vitest";
import router from './controller';
import * as message from './repository';
import { getRandomGif } from '../../utils/gifService';


vi.mock('./repository');
vi.mock('../templates/repository');
vi.mock('../../utils/gifService');
vi.mock('../../utils/discordBot');
vi.mock('../sprints/repository');

const app = express();
app.use(express.json());
app.use('/', router);

describe('Message Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /', () => {
    it('should return all messages', async () => {
      const mockMessages = [{ id: 1, username: 'user1', sprintCode: 'SPR001',
        gifUrl: 'https://example.com/gif', message: 'Congratulations!' }];
      message.getAllMessages.mockResolvedValue(mockMessages);

      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMessages);
    });

    it('should return messages by username', async () => {
      const username = 'user1';
      const mockMessages = [{ id: 1, username: 'user1', sprintCode: 'SPR001',
        gifUrl: 'https://example.com/gif', message: 'Congratulations!' }];
      message.findByUsername.mockResolvedValue(mockMessages);

      const response = await request(app).get(`/?username=${username}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMessages);
    });

    it('should return messages by sprint', async () => {
      const sprintCode = 'SPR001';
      const mockMessages = [{ id: 1, username: 'user1', sprintCode: 'SPR001',
        gifUrl: 'https://example.com/gif', message: 'Congratulations!' }];
      message.findBySprint.mockResolvedValue(mockMessages);

      const response = await request(app).get(`/?sprint=${sprintCode}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMessages);
    });

    it('should return 404 if no messages found for username', async () => {
      const username = 'user_not_found';
      message.findByUsername.mockResolvedValue([]);

      const response = await request(app).get(`/?username=${username}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual('No messages found for the specified user');
    });

    it('should return 404 if no messages found for sprint', async () => {
      const sprintCode = 'SPR002';
      message.findBySprint.mockResolvedValue([]);

      const response = await request(app).get(`/?sprint=${sprintCode}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual('No messages found for the specified sprint');
    });
  });

  describe('POST /', () => {
    it('should return 500 if failed to fetch celebration GIF', async () => {
      const mockRequestBody = { username: 'user1', sprintCode: 'SPR001' };
      getRandomGif.mockResolvedValue(undefined);

      const response = await request(app)
        .post('/')
        .send(mockRequestBody);

      expect(response.status).toBe(500);
    });
  });
});
