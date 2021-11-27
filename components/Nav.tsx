/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import Link from 'next/link';
import * as SeparatorPrimitive from '@radix-ui/react-separator';

export const Nav = () => {
  return (
    <nav>
      <Link href='/'>
        <a>Home</a>
      </Link>
      <SeparatorPrimitive.Root orientation='vertical' />
      <Link href='/set'>
        <a>Set</a>
      </Link>
      <SeparatorPrimitive.Root orientation='vertical' />
      <Link href='https://github.com/devjmetivier/djm.sh'>
        <a target='_blank'>Github</a>
      </Link>
    </nav>
  );
};
