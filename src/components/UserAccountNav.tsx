'use client'
import React from 'react'
import { User} from 'next-auth'
import { DropdownMenu, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import UserAvatar from './UserAvatar'
import { DropdownMenuContent, DropdownMenuItem } from './ui/Dropdown'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

type Props = {
  user: Pick< User, 'name' | 'image' | 'email' >
}

function UserAccountNav({user}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
        className='h-8 w-8'
        user={{
          name:user.name || null, image:user.image || null
        }} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
      className='bg-white' align='end'
      >
        <div
        className='flex flex-col space-y-1 leading-none'
        >
          {user.name && <p className='font-medium'>{user.name}</p>}
          {user.email && <p className='w-[200px]truncate text-sm '>{user.email}</p>}
        </div>
        <DropdownMenuSeparator/>
        <DropdownMenuItem asChild>
          <Link href='/'>Feed</Link>

        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/r/create'>Create Community</Link>

        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/settings'>Settings</Link>

        </DropdownMenuItem>
        <DropdownMenuSeparator/>
        <DropdownMenuItem 
        onSelect={(event)=>{
          event.preventDefault
          signOut({
            callbackUrl:`${window.location.origin}/sign-in`
          })
        }}
        className='cursor-pointer' >
         Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccountNav