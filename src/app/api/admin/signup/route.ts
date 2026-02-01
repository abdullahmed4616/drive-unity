import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "../crypto/bycryptjs";
import { GET } from "../cookies/httpCookies";

export async function POST(req:NextRequest) {
    try {
        const {name,email,password} = await req.json();
        if(!email || !password){
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        const existingUser = await db.user.findUnique({
            where:{email}
        });

        if(existingUser){
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 409 }
            );
        }

        const hashedPassword = await hashPassword(password);

        const user = await db.user.create({
            data:{
                name,
                email,
                password: hashedPassword,
            },
            select:{
                id:true,
                name:true,
                email:true,
                createdAt:true
            }
        });
        await GET(user)
        return NextResponse.json({
            success: true,
            user
        }, { status: 201 });  
    } catch (error) {
        console.error('Sign up error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}