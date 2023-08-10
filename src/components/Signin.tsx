import React from 'react'
import { Icons } from './Icons'
import Link from 'next/link'
import Auth from './Auth'

const Signin = () => {
  return (
    <div className='container mx-auto flex w-full flex-cols justify-center items-center space-y-6 sm:w-[400]'>
        <div className='flex flex-col space-y-2 text-center'>
            <Icons.logo
            className='mx-auto h-6 w-6'
            />
            <h1 className='text-2xl font-semibold tracking-light'>Welcome Back</h1>
            <p className='text-sm max-w-xs mx-auto'>By continuing you ate agreeing to our terms and conditons and agreeing to aur terms anc conditons</p>
              <Auth/>
            <p className='text-center px-8 text-sm text-zinc-600'>
              {/* Sign in form  */}

              New to Bredit? {' '}
              <Link href='/sign-in' className='hover:text-zinc-900 text-sm underline underline-offset-4'>Sign up</Link>
            </p>
        </div>
        </div>
  )
}

export default Signin