'use client'
import { Session } from 'next-auth';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {FC} from 'react'
import UserAvatar from './UserAvatar';
import { Input } from './ui/input';
import { Button } from './ui/Button';
import { Ghost, ImageIcon, Link2, LucideGhost } from 'lucide-react';



interface CreatePostProps {
  session?:Session | null
}
 
const CreatePost: FC<CreatePostProps> = ({session}) => {
  const router =useRouter();
  const pathName=usePathname();
  return (
  <li className='overflow-hidden rounded-md bg-white shadow'>
    <div className='h-full px-6 py-4 flex justify-between gap-6'>
      <div className='relative'>
       <UserAvatar 
       user={{
          name:session?.user.name || null,
          image:session?.user.image || null
       }}
       />
       <span className=' absolute top-6 left-1 rounded-full w-3 h-3 bg-green-500 outline-2 outline-white'></span>
      </div>
      <Input
      readOnly
      onClick={()=>router.push(pathName + '/submit')}
      placeholder='create post'
      />
      <Button
      variant='ghost'
      onClick={()=> router.push(pathName  + "/submit")}
      >      
      <ImageIcon className='text-xinc-600'/>  
      </Button>
        <Button
      variant='ghost'      
      onClick={()=> router.push(pathName  + "/submit")}
      >
        <Link2 className='text-zinc-600'/>
      </Button>
    </div>
  </li>
  );
}
 
export default CreatePost;