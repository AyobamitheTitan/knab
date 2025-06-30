import { fail, redirect } from '@sveltejs/kit';
import { config } from 'dotenv';

config()

/** @satisfies {import('./$types').Actions} */
export const actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData()
        const SERVER_URL = process.env.SERVER_URL

        if (!SERVER_URL) {
            return fail(500, { message: "SERVER_URL not set. Please contact the developer in charge", error: true })
        }


        const signup = await fetch(SERVER_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                mutation Signup($signupUserDTO: SignupUserDTO!) {
                    signUp(signupUserDTO: $signupUserDTO) {
                        email
                        phone_number
                        token
                    }
                }
                `,
                variables: {
                    signupUserDTO: {
                        "email": formData.get("Email"),
                        "phone_number": Number(formData.get("Phone Number")),
                        "first_name": formData.get("First Name"),
                        "last_name": formData.get("Last Name"),
                        "password": formData.get("Password"),
                        "dob": new Date(formData.get("DOB")).toISOString()
                    }
                }
            })
        })

        if (!signup.ok) {
            return fail(signup.status, { error: true, message: "An unknown error has occurred." })
        }

        /**
        * @type {GraphQLServerSignUpResponse} response
        */
        const response = await signup.json()
        if (response.errors) {
            return fail(response.errors[0].extensions.statusCode, { message: response.errors[0].message, error: true })
        } else if(response.data){            
            cookies.set("session", response.data.signUp.token,{
                httpOnly:true,
                sameSite:"strict",
                path:"/",
                secure: process.env.NODE_ENV === "production",
                maxAge:60*60*24*30
            })
            cookies.set("session-generated", new Date().toISOString(),{
                httpOnly:true,
                sameSite:"strict",
                path:"/",
                secure: process.env.NODE_ENV === "production",
                maxAge:60*60*24*30
            })
            redirect(301, "/dashboard")
        }else{
            return fail(500,{message:"An unknown error occurred. Please contact the developer in charge"})
        }
    }
};