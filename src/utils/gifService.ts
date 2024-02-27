import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config()

const apiKey = process.env.GIPGHY_API_KEY

export async function getRandomGif(): Promise<string | null> {
  try {
    const response = await axios.get('https://api.giphy.com/v1/gifs/random', {
      params: {
        api_key: apiKey,
        tag: 'celebrate',
      },
    });
    return response.data?.data?.images?.downsized_large?.url || null;
  } catch (error) {
    console.error('Error fetching random GIF:', error);
    return null;
  }
}
