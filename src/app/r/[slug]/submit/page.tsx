import Editor from '@/components/Editor';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import React from 'react'

interface pageProps {
    params:{
        slug:string; 
    }
}
 

const  page=async({params}:pageProps)=> {
    const subreddit= await db.subreddit.findFirst({
        where:{
            name:params.slug
        }
    })
    if(!subreddit) return notFound()
  return (
    <div className='flex flex-col items-start gap-6'>
        <div className='border-b border-gray-200 pb-6'>
            <div className='-ml-2 -mt-2 flex flex-wrap items-baseline'>
                <h3 className='ml-2 mt-2 text-base font-semibold leading-6 text-gray-900'>
                    Create Post
                </h3>
                <p className='ml-2 truncate text-sm'>
                    in r/{params.slug}
                </p>
            </div>
        </div>
         <Editor subredditId={subreddit.id}/>
        <div className='w-full flex justify-end'>
            <Button type='submit' form='subreddit-form'>Post</Button>
        </div>
    </div>
  )
}

export default page