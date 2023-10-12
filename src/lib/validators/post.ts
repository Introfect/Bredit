import {z} from 'zod'

export const PostValidator=z.object({
    title:z.string()
    .min(3,{message:'Title must be more than 3 characters'})
    .max(123,{message:'Title cannot be more than123 characters'}),
    subredditId:z.string(),
    content:z.any(),
})

export type PostCreationRequest=z.infer<typeof PostValidator>