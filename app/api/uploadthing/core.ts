

import { auth } from "@clerk/nextjs/server";

import { createUploadthing, type FileRouter } from "uploadthing/next";


const f = createUploadthing();

const handleAuth = async () =>{
    const {userId} = await auth()
    if(!userId) throw new Error('Unauthtirized')
        return {userId:userId}
}


export const ourFileRouter = {
  serverImage:f({image:{maxFileSize:"4MB",maxFileCount:1}})
  .middleware(()=>handleAuth())
  .onUploadComplete(async()=>{
return
  }),
  messageFile:f(["image","pdf"])
  .middleware(()=>handleAuth())
  .onUploadComplete(async()=>{})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;