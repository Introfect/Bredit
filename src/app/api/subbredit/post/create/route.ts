import { authOptions, getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
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
        const {subredditId,title,content}=PostValidator.parse(body)
        const SubscriptionExist= await db.subscription.findFirst({
            where:{
                subredditId,
                userId:session.user.id
            }
        })
        if(!SubscriptionExist){
            return new Response("You need to subscribe to this to start posting trash here ",{status:400})
        }
        await db.post.create({
            data:{
                title,
                content,
                authorId:session.user.id,
                subredditId
            }
        })
        return new Response('OK')
    }catch (error) {
        if (error instanceof z.ZodError) {
          return new Response("Invalid data", { status: 422 })
        }
    
        return new Response('Could not post', { status: 500 })
      }
}