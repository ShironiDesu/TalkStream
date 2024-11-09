import { RedirectToSignIn } from "@clerk/nextjs";

import { db } from "./db";
import { currentUser } from "@clerk/nextjs/server";

export const initialProfile = async () =>{
    const user = await currentUser()
    // console.log(user);
    
    if(!user) {
        return RedirectToSignIn
    }
    const profile = await db.profile.findUnique({
        where:{
            userId: user.id
        }
        
    })
    if (profile) {
        console.log(profile);
        
          return profile  
    }

    const newProfile = await db.profile.create({
        data:{
            userId: user.id,
            name:`${user.firstName} ${user.lastName}`,
            imageUrl:user.imageUrl,
            email:user.emailAddresses[0].emailAddress
        }
    })
    return newProfile
}