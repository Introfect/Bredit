'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import TextAreaAutosize from 'react-textarea-autosize'
import {useForm} from 'react-hook-form'
import { PostCreationRequest, PostValidator } from '@/lib/validators/post'
import {zodResolver} from '@hookform/resolvers/zod'
import type EditorJS from'@editorjs/editorjs'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'
import { uploadFiles } from '@/lib/uploadthing'
import { Toast } from './ui/toast'
import { toast } from '@/hooks/use-toast'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
interface Props {
    subredditId:string
}

function Editor({subredditId}: Props) {
    const{
        register,
        handleSubmit,
        formState:{errors}
    
    }=useForm<PostCreationRequest>({
        resolver:zodResolver(PostValidator),
        defaultValues:{
            subredditId,
            title:'',
            content:null,

        }
    })
    const[isMounted,setIsMounted]=useState<boolean>(false)
    const pathname=usePathname()
    const router = useRouter()
    useEffect(()=>{
        if(typeof window !== 'undefined'){
            setIsMounted(true)
        }

    },[])

    const ref=useRef<EditorJS>()
    const _titleRef=useRef<HTMLTextAreaElement>(null)

    const initalizeEditor=useCallback(async()=>{
        const EditorJS= (await import('@editorjs/editorjs')).default
        const Header= (await import('@editorjs/header')).default
        const Embed= (await import('@editorjs/embed')).default
        const Table= (await import('@editorjs/table')).default
        const List= (await import('@editorjs/list')).default
        const Code= (await import('@editorjs/code')).default
        const LinkTool= (await import('@editorjs/link')).default
        const InlineCode= (await import('@editorjs/inline-code')).default
        const ImageTool= (await import('@editorjs/image')).default

        if(!ref.current){
            const editor =new EditorJS({
                holder:'editor',
                onReady(){
                    ref.current=editor
                 },
                 placeholder:'Type your post here ...',
                 inlineToolbar:true,
                 data:{blocks:[]},
                 tools:{
                    header:Header,
                    linkTool:{
                        class:LinkTool,
                        config:{
                            endpoint: '/api/link'
                        }
                    },
                    image:{
                        class:ImageTool,
                        config:{
                            uploader:{
                                async uploadByFile(file:File){
                                    const [res]= await uploadFiles([file], 'imageUploader')

                                    return {
                                        success:1,
                                        file:{
                                            url:res.fileUrl
                                        }
                                    }
                                }
                            }
                        }


                    },
                    list:List,
                    code:Code,
                    inlineCode:InlineCode,
                    table:Table,
                    embed:Embed
                 }
            })
        }
    },[])

    useEffect(()=>{
        const init=async ()=>{
            await initalizeEditor()
            setTimeout(()=>{
                _titleRef.current?.focus()

            },0)
        }
        if(isMounted){
            init()
            return ()=>{
                ref.current?.destroy()
                ref.current=undefined
            }
        }

    },[isMounted,initalizeEditor])


    const {mutate:createPost}=useMutation({
        mutationFn:async ({
            title,
            content,
            subredditId
        }:PostCreationRequest)=>{
            const payload:PostCreationRequest={
            subredditId,
            title,
            content
        }
        const {data}= await axios.post('/api/subbredit/post/create',payload)
       return data
    },
    onError:(e)=>{
        if(e instanceof AxiosError){
            if(e.response?.status===422){
                return toast({
                    title:'validation error',
                    description:'v',
                    variant:'destructive'
                })
            }

        }
        else{

            return toast({
                title:'Something went wrong',
                description:'something went wrong please try again later', 
                variant:'destructive',
            })
        }
    },
    onSuccess:()=>{
        const newPathname= pathname.split('/').slice(0,-1).join('/')
        router.push(newPathname)
        router.refresh()
        toast({
            title:'succesfully posted trash here',
            variant:'default'
        })


    }
    })
    async function onSubmit(data:PostCreationRequest ){
       const blocks= await ref.current?.save();

       const payload:PostCreationRequest={
        title:data.title,
        content:blocks,
        subredditId
       }
       createPost(payload)
    }

    useEffect(()=>{
        if(Object.keys(errors).length){
            for(const [_key,value]of Object.entries(errors)){
                toast({
                    title:'Something went wrong',
                    description:(value as {message:string}).message,
                    variant:'destructive'
                })
            }
        }

    },[errors])
    if(!isMounted){
        return null
    }
    const {ref:titleRef, ...rest}=register('title')
  return (
    <div className='w-full p-4 bg-zinc-50 rounded-lg border border-zinc-300'>
        <form id='subreddit-form' className='w-fit' onSubmit={handleSubmit(onSubmit)}>
            <div className='prose prose-stone dark:prose-invert'>
                <TextAreaAutosize 
                ref={(e)=>{
                    titleRef(e)
                    //@ts-ignore
                    _titleRef.current=e
                }}
                {...rest}
             
                placeholder='Title' 
                className='w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none'
                />
                <div 
                className='min-h-[500px]'
                id='editor'/>
              </div>
        </form>
        </div>
  )
}

export default Editor 