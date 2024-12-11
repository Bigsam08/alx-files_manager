import { promisify } from 'util';
import { createClient } from 'redis';


class RedisClient {
  /**
   * Creates a new RedisClient instance.
   */
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  /**
   * Checks if the client's connection to the Redis server is active. */
  isAlive() {
    return this.isClientConnected;
  }

  /** Get the value using a key */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /** set the value and duration using key */
  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  /** Removes the value of a given key. */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
