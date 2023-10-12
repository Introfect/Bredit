import { authOptions, getAuthSession } from "@/lib/auth";
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
        if(SubscriptionExist){
            return new Response("You are already subscribed to this Shit!",{status:400})
        }
        await db.subscription.create({
            data:{
                subredditId,
                userId:session.user.id,
            }
        })
        return new Response(subredditId)
    }catch (error) {
        if (error instanceof z.ZodError) {
          return new Response("Invalid data", { status: 422 })
        }
    
        return new Response('Could not subscribe', { status: 500 })
      }
}