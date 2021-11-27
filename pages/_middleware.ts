import { NextRequest, NextFetchEvent } from 'next/server';

import { redirect } from '../lib';

export async function middleware(...args: [req: NextRequest, event: NextFetchEvent]) {
  return await redirect(...args);
}
