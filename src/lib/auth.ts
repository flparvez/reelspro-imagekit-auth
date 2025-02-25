//  NextAuthOption

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDb } from "./db";
import User from "@/models/User";
import bcrypt from 'bcryptjs'


export const authOptions:NextAuthOptions = {
    providers : [
        GoogleProvider({
            clientId : process.env.GOOGLE_CLIENT_ID!,
            clientSecret : process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
            name : "Credentials",
            credentials : {
                name : {
                    label : "Name",
                    type : "text",
                    placeholder : "Name"
                },
                email : {
                    label : "Email",
                    type : "email",
                    placeholder : "Email"
                },
                password : {
                    label : "Password",
                    type : "password",
                    placeholder : "Password"
                },
                role: {
                    label: "Role",
                    type: "text",
                    placeholder: "Role"
                }
            },
             async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and Password is required");
                }

             try {
                await    connectToDb();
                const user = await User.findOne({email : credentials.email});
                if (!user) {
                    throw new Error("User Not Found");
                }
                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isValid) {
                        throw new Error("Wrong Password");
                    }
           
                return {
                    id: user._id.toString(),
                    email : user.email,
                    name : user.name,
                    role : user.role,
                }
             } catch (error) {
                throw new Error("Database Error"+error);
             }



             }

        })
    ],

    //  callbacks

    callbacks : {
        // signIn: async({user,account}) =>{
      
        //     if (account?.provider === 'google') {
        //       try {
        //         const {email,name,id} =user;
    
        //          await connectToDb();
        //          const alreadyUser = await User.findOne({email});
        //          if(!alreadyUser) await User.create({email,name,googleId:id})
    
        //           return true;
    
        //       } catch (err) {
        //         throw  err
        //       }
        //     }
        //     return false;
        
          
        // },
        async jwt({token, user}){
            if (user) {
                token.id = user.id
                token.name = user.name
                token.role = user.role
                
            }

            return token
        },

        //  session
        async session({session, token}) {
            if(session.user){
                session.user.id = token.id as string
                session.user.name = token.name as string
                session.user.role = token.role as string
            }

            return session
        }
    },
    
    pages : {
      signIn: "/auth/login",  
      error : "/auth/login"
    },
    session : {
        strategy : "jwt",
        maxAge : 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET
}


