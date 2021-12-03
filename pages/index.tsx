/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import useSWRInfinite from 'swr/infinite';

import { Nav } from '../components';

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const DEFAULT_LIMIT = 9;

export default function Index({ initialData, limit }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, isValidating, setSize, mutate, size } = useSWRInfinite<string[]>(
    (pageIndex) => `/api/list?page=${pageIndex}&limit=${limit}`,
    fetcher,
    {
      fallbackData: [initialData],
      initialSize: 1,
      revalidateOnFocus: false,
      revalidateOnMount: false,
    },
  );

  const isLoadingMore = React.useMemo(() => size > 0 && data && typeof data[size - 1] === 'undefined', [data, size]);
  const isReachingEnd = React.useMemo(() => data && data[data.length - 1].length < DEFAULT_LIMIT, [data]);
  const isRefreshing = React.useMemo(() => isValidating && data && data.length === size, [data, isValidating, size]);

  return (
    <main className='container'>
      <Head>
        <title>djm.sh</title>
        <link href='https://fonts.googleapis.com' rel='preconnect' />
        <link crossOrigin='anonymous' href='https://fonts.gstatic.com' rel='preconnect' />
        <link href='https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap' rel='stylesheet' />
      </Head>

      <h1>djm.sh</h1>
      <Nav />

      <div className='link-table'>
        {data &&
          data.map((redirects) =>
            redirects.map((redirect) => (
              <a
                href={redirect.includes(':') ? `/${redirect.split(':')[0]}/${redirect.split(':')[1]}` : `/${redirect}`}
                key={redirect}
                rel='noreferrer'
                target='_blank'
              >
                <span className='truncate'>{redirect}</span>
                <span>
                  {String.fromCharCode(45)}
                  {String.fromCharCode(62)}
                </span>
              </a>
            )),
          )}
      </div>

      <div className='actions'>
        <div>
          <button disabled={isLoadingMore || isReachingEnd} onClick={() => setSize((prev) => prev + 1)}>
            {isLoadingMore ? 'Loading...' : isReachingEnd ? 'No More' : 'Load More'}
          </button>
          <button disabled={isRefreshing} onClick={() => mutate()}>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<{ initialData: string[]; limit: number }> = async ({ query }) => {
  const { limit } = query;

  const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://djm.sh';
  const request = new Request(`${baseUrl}/api/list?page=0&limit=${limit ?? DEFAULT_LIMIT}`, {
    method: 'GET',
    mode: 'same-origin',
  });
  const res = await fetch(request);
  const initialData: string[] = await res.json();

  return {
    props: { initialData, limit: limit ? Number(limit) : DEFAULT_LIMIT },
  };
};
