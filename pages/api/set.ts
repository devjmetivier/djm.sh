import { get, lpush, set } from '@upstash/redis';
import type { NextApiRequest, NextApiResponse } from 'next';

import { Pair } from '../../types';
import '../../utils/auth';

export default async function upstashSet(req: NextApiRequest, res: NextApiResponse) {
  const { method, headers } = req;
  const { key, value }: Pair = req.body;

  if (method !== 'POST') return res.status(400).send({ error: 'POST method is required for this endpoint.' });
  if (!key || !value)
    return res.status(400).send({ error: 'This endpoint requires both a `key` and `value` property.' });

  if (!headers.authorization) return res.status(401).send({ error: 'Unauthorized' });
  if (headers.authorization.split('Bearer')[1].trim() !== process.env.PASSWORD)
    return res.status(401).send({ error: 'Unauthorized' });

  const sanitizedKey = key.trim().toLowerCase();

  try {
    const { data: getData, error: getError } = await get(sanitizedKey);
    if (getError) return res.status(400).send(getError);
    if (getData)
      return res.status(400).send({ error: 'This record already exists. Overwriting records is disallowed.' });

    const [record, list] = await Promise.all([
      set(sanitizedKey, encodeURIComponent(value)),
      lpush('redirects', sanitizedKey),
    ]);

    if (record.error) return res.status(400).send(record.error);
    if (list.error) return res.status(400).send(list.error);

    return res.status(201).send({ key: sanitizedKey, value });
  } catch (error) {
    throw new Error(error);
  }
}
