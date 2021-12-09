import { auth as upstashAuth } from '@upstash/redis';

(() => upstashAuth(process.env.UPSTASH_REDIS_REST_URL, process.env.UPSTASH_REDIS_REST_TOKEN))();
