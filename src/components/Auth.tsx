'use client'
import { cn } from "@/lib/utils";
import { Button } from "./ui/Button";
import { useState } from "react";
import {signIn} from 'next-auth/react'
import { toast } from "@/hooks/use-toast";



const Auth= () => {
    console.log(process.env.GOOGLE_CLIENT_ID)
    const [isLoading, setIsLoading] =useState<boolean>(false)
    const login= async()=>{
        setIsLoading(true);
        try{
            await signIn('google')
        }catch(error){
            //toast notification
              toast({
                title:'There was a problem',
                description:'this is the description of the error ',
                variant:'destructive'
              })

        }finally{
            setIsLoading(false)
        }
    }
    return ( 
        <div className='flex justify-center'>

       <Button onClick={()=>login()} isLoading={isLoading} size='sm' className="w-full">
          Google
       </Button>
        </div>
     );
}
 
export default Auth;