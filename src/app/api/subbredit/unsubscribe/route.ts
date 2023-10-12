
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubbreditSubscriptionValidator } from "@/lib/validators/subbredit";
import { getServerSession } from "next-auth";
import {z} from 'zod'

export async function POST(req: Request){
    try{
        const session =await  getServerSession(authOptions)
        if(!session?.user){
           return new Response('Unauthorized',{status:401})
        }
        const body=await req.json()
        const {subredditId}=SubbreditSubscriptionValidator.parse(body)
        const SubscriptionExist= await db.subscription.findFirst({
            where:{
                subredditId,
                userId:session.user.id
            }
        })
        if(!SubscriptionExist){
            return new Response("You are not subscribed to this Shit!",{status:400})
        }
         //check is user is owner of the subreddit 
         const subscription=await db.subreddit.findFirst({
            where:{
                id:subredditId,
                creatorId:session.user.id
            }
         })
         if(subscription){
            return new Response('you cannot unsubscribe to your own subbredit',{
                status:400
            })
         }
        await db.subscription.delete({
            where:{
                userId_subredditId:{
                    subredditId,
                    userId:session?.user.id
                }
            }
        })
        return new Response(subredditId)
    }catch (error) {
        if (error instanceof z.ZodError) {
          return new Response("Invalid data", { status: 422 })
        }
    
        return new Response('Could not Unsubscribe please try later', { status: 500 })
      }
}