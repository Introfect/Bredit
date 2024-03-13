import { FC} from 'react'
import { authOptions, getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import CreatePost from '@/components/CreatePost';
import { getServerSession } from 'next-auth';
import PostFeed from '@/components/PostFeed';
import {INFINITE_SCROLL} from "@/config"
interface PageProps {
    params:{
        slug:string; 
    }
}
 
const page= async ({params}:PageProps) => {
    const { slug }=params
    const session =await getServerSession(authOptions)
    const subbredit=await db.subreddit.findFirst({
        where:{name:slug},
        include:{
            posts:{
                include:{
                    author:true,
                    votes:true,
                    comments:true,
                    subreddit:true
                },
                orderBy:{
                    createdAt:'desc'

                },
                take: INFINITE_SCROLL
            }
        }
    })
    if (!subbredit) return notFound()
    return (
    <>
    <h1 className='font-bold text-3xl md:text-4xl h-12'>
    {`r/${slug}`}
    </h1>
    <div>

    <CreatePost session={session}/>
    <PostFeed initialPosts={subbredit.posts}
    subredditName={subbredit.name}
    />
    </div>
     </> 
     );
}
 
export default page;