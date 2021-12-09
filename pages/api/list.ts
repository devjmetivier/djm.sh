import { lrange } from '@upstash/redis';
import type { NextApiRequest, NextApiResponse } from 'next';
import '../../utils/auth';

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

    return res.status(200).send(range);
  } catch (error) {
    throw new Error(error);
  }
}
