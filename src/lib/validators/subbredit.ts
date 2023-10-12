import {z} from 'zod'

export const SubbreditValidator= z.object({
    name: z.string().min(3).max(29)
}) 

export const SubbreditSubscriptionValidator= z.object({
    subredditId: z.string()
}) 



export type CreateSubbreditPayload = z.infer<typeof SubbreditValidator>
export type SubascribeToSubbreditPayload = z.infer<typeof SubbreditSubscriptionValidator>