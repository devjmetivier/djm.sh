import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { get, hget } from '@upstash/redis';

const whiteList = ['api', 'set'];

export async function redirect(req: NextRequest, event: NextFetchEvent) {
  const { pathname } = req.nextUrl;
  const splitPath = pathname.split('/');
  const key = splitPath[1];
  const property = splitPath[2];

  if (key.length < 1 || whiteList.includes(key)) return NextResponse.next();

  if (property && property.length > 1) {
    try {
      const { data, error } = await hget(key, property);
      if (error || typeof data !== 'string') return NextResponse.next();

      return NextResponse.redirect(decodeURIComponent(data));
    } catch (error) {
      console.log({ error });
      return NextResponse.redirect('/', 404);
    }
  }

  try {
    const { data, error } = await get(key);
    if (error || typeof data !== 'string') return NextResponse.next();

    return NextResponse.redirect(decodeURIComponent(data));
  } catch (error) {
    console.log({ error });
    return NextResponse.redirect('/', 404);
  }
}
