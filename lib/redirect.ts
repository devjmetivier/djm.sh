import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { get } from '@upstash/redis';

const whiteList = ['api', 'set'];

export async function redirect(req: NextRequest, event: NextFetchEvent) {
  const { pathname } = req.nextUrl;
  const key = pathname.split('/')[1];

  if (key.length < 1 || whiteList.includes(key)) return NextResponse.next();

  try {
    const { data, error } = await get(key);
    if (error || typeof data !== 'string') return NextResponse.next();

    return NextResponse.redirect(decodeURIComponent(data));
  } catch (error) {
    console.log({ error });
    return NextResponse.redirect('/', 404);
  }
}
