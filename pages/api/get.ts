import { get } from '@upstash/redis';
import ms from 'ms';
import type { NextApiRequest, NextApiResponse } from 'next';

import { Key } from '../../types';
import '../../utils/auth';

export default async function upstashGet(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { key }: Key = req.body;

  if (method !== 'GET') return res.status(400).send({ error: 'GET method is required for this endpoint.' });
  if (key.length < 1) return res.status(400).send({ error: 'This endpoint requires a `key` property.' });

  try {
    const { data, error } = await get(key);
    if (error) return res.status(400).send(error);

    res.setHeader('Cache-Control', `s-maxage=${ms('1y') / 1000}, stale-while-revalidate`);
    return res.status(200).send(decodeURIComponent(data));
  } catch (error) {
    throw new Error(error);
  }
}
