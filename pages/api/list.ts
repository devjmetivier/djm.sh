import type { NextApiRequest, NextApiResponse } from 'next';
import { lrange, mget } from '@upstash/redis';

export default async function upstashList(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const limit = req.query.limit ? Number(req.query.limit) : 5;
  const page = req.query.page ? Number(req.query.page) : 0;

  if (method !== 'GET') return res.status(400).send({ error: 'GET method is required for this endpoint.' });

  try {
    const startIndex = page * limit;
    const endIndex = startIndex + limit - 1;

    const { data: range, error: rangeError } = await lrange('redirects', startIndex, endIndex);
    if (rangeError) return res.status(400).send(rangeError);

    if ((range as string[]).length < 1) return res.status(200).send([]);

    const { data, error } = await mget(...range);
    if (error) return res.status(400).send(error);

    const response = range.map((key: string, i: number) => ({ key, value: decodeURIComponent(data[i]) }));

    return res.status(200).send(response);
  } catch (error) {
    throw new Error(error);
  }
}
