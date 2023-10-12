'use client'
import React, { FC, startTransition } from 'react'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import { SubascribeToSubbreditPayload } from '@/lib/validators/subbredit'
import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { useRouter } from 'next/navigation'

interface SubTogleProps  {
    subredditId:string,
    subredditName:string,
    isSubscribed:boolean
}

const SubTogle: FC<SubTogleProps>=({
    subredditId,
    subredditName,
    isSubscribed
}) =>
{
    const router=useRouter()
    const{loginToast}=useCustomToast()
    const {mutate: subscribe, isLoading:isSubLoading}=useMutation({
        mutationFn:async()=>{
            const payload:SubascribeToSubbreditPayload={
                subredditId,
            }
            const { data }= await axios.post('/api/subbredit/subscribe',payload)
            return data as string
        },
        onError:(err)=>{
        
            if( err instanceof AxiosError){
                if(err.response?.status===401){
                    return loginToast()
                }
            }
            return toast({
                title:"Your lucks bad",
                description:"cant do anything to your luck",
                variant:'destructive'
            })
        },
        onSuccess:()=>{
            startTransition(()=>{
              router.refresh()
            })
            return  toast({
                title:'Subscribed',
                description:`Subscribed to ${subredditName}`,
                variant:'default'
            })
        }
    })
    const {mutate: unsubscribe, isLoading:isUnSubLoading}=useMutation({
        mutationFn:async()=>{
            const payload:SubascribeToSubbreditPayload={
                subredditId,
            }
            const { data }= await axios.post('/api/subbredit/unsubscribe',payload)
            return data as string
        },
        onError:(err)=>{
           
            if( err instanceof AxiosError){
                if(err.response?.status===401){
                    return loginToast()
                }
            }
            return (
                toast({
                title:"Your lucks bad",
                description:"cant do anything to your luck",
                variant:'destructive'
            })
            )
        },
        onSuccess:()=>{
            startTransition(()=>{   
              router.refresh()
            })
            return  toast({
                title:'Un Subscribed',
                description:`unSubscribed to ${subredditName}`,
                variant:'default'
            })
        }
    })
  return (
    isSubscribed?(
        <Button
        onClick={()=>unsubscribe()}
        isLoading={isUnSubLoading}
        className='w-full mt-1 mb-4'>Leave Trash</Button>
    ):(
        <Button 
        isLoading={isSubLoading}
           onClick={()=>subscribe()}
        className='w-full mt-1 mb-4'>Join Trash</Button>
    )
  )
  
}

export default SubTogle