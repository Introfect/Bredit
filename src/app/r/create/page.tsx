'use client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import React, {useState} from 'react'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { CreateSubbreditPayload } from '@/lib/validators/subbredit'
import { toast } from '@/hooks/use-toast'
import { useCustomToast } from '@/hooks/use-custom-toast'

function page() {
  const { loginToast }= useCustomToast()
    const [input, setInput]=useState<string>('')
    const router= useRouter()
    const {mutate:createCommunity, isLoading}=useMutation({
      mutationFn: async ()=>{
        const payload: CreateSubbreditPayload={
          name:input
        }

        const {data}= await axios.post('/api/subbredit', payload)
        return data as string
      },
      onError: (err)=>{
        if(err instanceof AxiosError) {
          if(err.response?.status === 409){
            return toast({
              title:'Subbredit with this name already exists',
              description:'Please choose a different name fot your subbredit',
              variant:'destructive'
            })
          }

          if(err.response?.status === 422){
            return toast({
              title:'Inavlid validation ',
              description:'Please choose a different name fot your subbredit',
              variant:'destructive'
            })
          }
          if(err.response?.status === 401){
            return loginToast()
          }
        }
        toast({
          title:'There was an error',
          description:'could not create subbredit',
          variant:'destructive'
        })

      },
      onSuccess: (data)=>{
        router.push(`/r/${data}`)
 
      }

    })
  return (
  <div className='container flex items-center h-full max-w-3xl mx-auto'>
     <div className='relative bg-white w-full h-fit p-4 rounded-lg space-y-6'>
      <div className='flex justify-between items-center'>
        <h1>Create a Community</h1>        
      </div>
      <hr className='bg-zinc-600'></hr>
      <div>
        <p className='tetx-lg font-medium'>Name</p>
        <p className='text-xs pb-2'> Community names including capitalization cannot be changed</p>
        <div className='relative'>
          <p className='absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-500'>
            r/
          </p>
          <Input 
           className='pl-6'
           value={input} 
           onChange={(e)=>setInput(e.target.value)}/>
        </div>        
      </div>
      <div className='flex justify-end gap-4'>
         <Button variant='subtle' onClick={()=>router.back()}>Cancel</Button>
         <Button
         disabled={input.length===0}
         isLoading={isLoading}
         onClick={()=>createCommunity()}
         > Create Community</Button> 
      </div>      
     </div>
  </div>
  )
}

export default page