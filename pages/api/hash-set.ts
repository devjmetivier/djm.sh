import type { NextApiRequest, NextApiResponse } from 'next';
import { hset, hget, lpush } from '@upstash/redis';

import { HashSet } from '../../types';

export default async function upstashHashSet(req: NextApiRequest, res: NextApiResponse) {
  const { method, headers } = req;
  const { key, property, value }: HashSet = req.body;

  if (method !== 'POST') return res.status(400).send({ error: 'POST method is required for this endpoint.' });
  if (!key || !value)
    return res.status(400).send({ error: 'This endpoint requires `key`, `property` and `value` properties.' });

  if (!headers.authorization) return res.status(401).send({ error: 'Unauthorized' });
  if (headers.authorization.split('Bearer')[1].trim() !== process.env.PASSWORD)
    return res.status(401).send({ error: 'Unauthorized' });

  const sanitizedKey = key.trim().toLowerCase();
  const sanitizedProperty = property.trim().toLowerCase();

  try {
    const { data: getData, error: getError } = await hget(sanitizedKey, sanitizedProperty);
    if (getError) return res.status(400).send(getError);
    if (getData)
      return res.status(400).send({ error: 'This record already exists. Overwriting records is disallowed.' });

    const [record, list] = await Promise.all([
      hset(sanitizedKey, sanitizedProperty, encodeURIComponent(value)),
      lpush('redirects', `${sanitizedKey}:${sanitizedProperty}`),
    ]);

    if (record.error) return res.status(400).send(record.error);
    if (list.error) return res.status(400).send(list.error);

    return res.status(201).send({ key: sanitizedKey, property: sanitizedProperty, value });
  } catch (error) {
    throw new Error(error);
  }
}
