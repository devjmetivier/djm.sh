import type { NextApiRequest, NextApiResponse } from 'next';
import { hget } from '@upstash/redis';
import ms from 'ms';

import { HashGet } from '../../types';

export default async function upstashGet(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { key, property }: HashGet = req.body;

  if (method !== 'GET') return res.status(400).send({ error: 'GET method is required for this endpoint.' });
  if (key.length < 1) return res.status(400).send({ error: 'This endpoint requires a `key` and `property` property.' });

  try {
    const { data, error } = await hget(key, property);
    if (error) return res.status(400).send(error);

    res.setHeader('Cache-Control', `s-maxage=${ms('1y') / 1000}, stale-while-revalidate`);
    return res.status(200).send(decodeURIComponent(data));
  } catch (error) {
    throw new Error(error);
  }
}
