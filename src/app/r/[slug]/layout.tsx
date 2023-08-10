import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { format } from 'date-fns'



const Layout = async ({
    children,
    params:{slug}
}:{
    children:React.ReactNode,
    params:{slug:string}
}) =>
{
const session =await getAuthSession();
const subbredit= await db.subreddit.findFirst({
    where:{name:slug},
    include:{
        posts:{
            include:{
                author:true,
                votes:true,
            }
        }
    }
})

const subscription =!session?.user? 
   undefined:await db.subscription.findFirst({
    where:{
        subreddit:{
            name:slug
        },
       user:{
        id:session.user.id,
       } 
    }
   })
   const isSub= !!subscription
   if(!subbredit) return notFound();
   const memberCount = await db.subscription.count({
    where:{
        subreddit:{
            name:slug,
        }
    }
   })
  return (
    <div className="sm:container max-w-7xl mx-auto h-full">
    <div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        <div className="flex flex-cols col-span-2 space-y-6">
          {children}
        </div>
        <div className="hidden md:block overflow-hidden h-fit rounded-lg border-gray-200 order-first md:order-last">
            <div className="px-6 py-4">
                <p className="font-semibold py-3">About r/{subbredit.name}</p>
            </div>

            <dl className="divide-y divide-gray-100 px-6 tetx-sm leading-6 bg-white">
                <div className="justify justify-between gap-x-4 py-3">
                    <dt className="tetx-gray-500">Created</dt>
                    <dt className="text-gray-700">
                        <time dateTime={subbredit.createdAt.toDateString()}>
                          {format(subbredit.createdAt,"MMMM d, yyyy")}                    
                        </time>
                    </dt>
                </div>
                <div className="justify justify-between gap-x-4 py-3">
                    <dt className="tetx-gray-500">Members</dt>
                    <dt className="text-gray-700">
                        <div className="text-gray-800">{memberCount}</div>
                    </dt>
                </div>
                {
                    subbredit.creatorId===session?.user.id?(
                        <div className="flex justify-between gap-x-4 py-3">
                            <p>You created this shitty community</p>
                        </div>
                    ):null
                }
            </dl>
        </div>
    </div>
    </div>
    </div>
  )
}

export default Layout