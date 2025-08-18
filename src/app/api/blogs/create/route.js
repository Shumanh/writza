import { dbConnect } from "@/lib/db/mongodb";
import { NextResponse } from "next/server";
import Blog from "@/db/models/Blog";
import { BlogValidation } from "@/lib/validation/blog";
import {z} from "zod";


export  async function POST (req){

try{
    const body = await req.json();
    const {title , shortDescription , content} = body;

const inputValidate = BlogValidation.safeParse({title,shortDescription,content })
if(!inputValidate.success){
    return NextResponse.json({ errors: z.treeifyError(inputValidate.error) },
     {status:400}) ;
}

await dbConnect();

const savedBlog = await Blog.create(inputValidate.data)

return NextResponse.json( savedBlog , {status:201})

}


catch(error){
    console.error("Database or a server error" , error);
    return NextResponse.json(
  { error:"Internal Server Error"} ,
  {status:500}
    )
}


}