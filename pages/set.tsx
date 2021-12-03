/* eslint-disable no-useless-escape */
import * as React from 'react';
import { ErrorMessage } from '@hookform/error-message';
import { useForm } from 'react-hook-form';
import Head from 'next/head';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import { Nav } from '../components';

type FormData = { key: string; url: string; password: string };

export default function Set({ keyProp, password, url }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    register,
    formState: { errors, isSubmitting, isValidating },
    handleSubmit,
    setFocus,
    setValue,
  } = useForm({
    reValidateMode: 'onBlur',
    defaultValues: { key: keyProp, url: decodeURIComponent(url), password },
  });

  const onSubmit = React.useCallback(
    async ({ key, url, password }: FormData) => {
      let reqKey: string | undefined;
      let reqProperty: string | undefined;

      if (key.includes(':')) {
        const split = key.split(':');
        reqKey = split[0];
        reqProperty = split[1];
      }

      const request = new Request(typeof reqProperty !== 'undefined' ? '/api/hash-set' : '/api/set', {
        method: 'POST',
        mode: 'same-origin',
        headers: { Authorization: `Bearer ${password}`, 'Content-Type': 'application/json' },
        body:
          typeof reqProperty !== 'undefined'
            ? JSON.stringify({ key: reqKey, property: reqProperty, value: url })
            : JSON.stringify({ key, value: url }),
      });

      try {
        const res = await fetch(request);

        if (res.ok) {
          setValue('key', '');
          setValue('url', '');
          setFocus('key');
          return;
        }

        if (!res.ok) {
          setValue('password', '');
          return;
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    [setFocus, setValue],
  );

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
      <p>Add a new short Url</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='input-container'>
          <label htmlFor='key'>Key</label>
          <input
            autoFocus
            id='key'
            type='text'
            {...register('key', {
              required: 'Key is required',
              pattern: {
                value: /^[a-z0-9\-\_\:]*$/,
                message: 'Key must be alphanumeric and lowercase',
              },
            })}
          />
          <ErrorMessage as={<span className='error-message' />} errors={errors} name='key' />
        </div>

        <div className='input-container'>
          <label htmlFor='url'>Url</label>
          <input
            id='url'
            type='text'
            {...register('url', {
              required: 'Url is required',
              pattern: {
                value: /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
                message: 'Must be a valid Url.',
              },
            })}
          />
          <ErrorMessage as={<span className='error-message' />} errors={errors} name='url' />
        </div>

        <div className='input-container'>
          <label htmlFor='url'>Password</label>
          <input
            id='url'
            type='password'
            {...register('password', {
              required: 'Password is required',
            })}
          />
          <ErrorMessage as={<span className='error-message' />} errors={errors} name='password' />
        </div>

        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <input disabled={isSubmitting || isValidating} type='submit' />
      </form>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<{ keyProp?: string; url?: string; password?: string }> = async ({
  query,
}) => {
  const { key, password, url } = query;

  const keyProp = typeof key === 'string' ? key : key?.[0] ?? '';
  const pwProp = typeof password === 'string' ? password : password?.[0] ?? '';
  const urlProp = typeof url === 'string' ? url : url?.[0] ?? '';

  return { props: { keyProp, password: pwProp, url: urlProp } };
};
