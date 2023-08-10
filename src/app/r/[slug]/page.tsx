import { FC} from 'react'
import { PageProps } from '../../../../.next/types/app/layout';
import { authOptions, getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import CreatePost from '@/components/CreatePost';
import { getServerSession } from 'next-auth';
interface pageProps {
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
                take:2
            }
        }
    })
    if (!subbredit) return notFound()
    return (
    <>
    <h1 className='font-bold text-3xl md:text-4xl h-12'>
    {`r/${slug}`}
    </h1>
    <CreatePost session={session}/>
     </> 
     );
}
 
export default page;