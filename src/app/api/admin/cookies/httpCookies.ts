import { NextResponse } from "next/server";

interface User {
  id: string;
  name: string;
  email: string;
}

export async function GET(user:User){
    const response = NextResponse.json({message:'Cookie set!'});
    const TOKEN = process.env.TOKEN || ""
    const cookieValue = JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
    });
    response.cookies.set(TOKEN,cookieValue,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:60*60*24,
        path:'/'
    })

    return response
}

