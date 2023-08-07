import CloseModal from '@/components/CloseModal'
import Signin from '@/components/Signin'
import Signup from '@/components/Signup'
import React from 'react'

type Props = {}

function page({}: Props) {
  return (
    
        <div className='fixed inset-0 bg-zinc-900/20 z-10'>
            <div className='constainer flex items-center h-full max-w-lg mx-auto'>
                <div className='relative bg-white w-full h-fit py-20 rounded-lg'>
                    <div className='absolute top-4 right-4'>
                        <CloseModal/>

                    </div>
                    <Signup/>

                        
                </div>
            </div>

        </div>
    
  )
}

export default page