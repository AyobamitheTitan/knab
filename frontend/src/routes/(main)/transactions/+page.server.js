import { fail, json, redirect } from '@sveltejs/kit'

export const actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData()
        const SERVER_URL = process.env.SERVER_URL
        const session = cookies.get("session")

        if (!session) {
            redirect(301,"/login")
        }
        if (!SERVER_URL) {
            return fail(500, { message: "SERVER_URL not set. Please contact the developer in charge", error: true })
        }
        
        const transact = await fetch(SERVER_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${session}`
            },
            body: JSON.stringify({
                query: `
                    mutation Transact($transactDTO: AccountTransactDTO!){
                        transact(transactDTO:$transactDTO){
                            amount
                            date
                            status
                            description
                            type
                        }
                    },
                `,
                variables: {
                    transactDTO: {
                        amount: Number(formData.get("amount")),
                        account_id: formData.get("account_id"),
                        description: formData.get("description"),
                        transaction_type:formData.get("transaction_type"),
                        pin:formData.get("pin")
                    }
                }
            })
        })

        if (!transact.ok) {
            console.log(await transact.json());
            
            return fail(transact.status,{error:true, message: "An unknown error has occurred."})   
        }
        const response = await transact.json()
        
        console.log(response);
        
        if (response.errors) {
            return fail(response.errors[0].extensions.statusCode, { message: response.errors[0].message, error: true })
        } else if (response.data) {
            return {data:response.data, error:false }
        } {
            return fail(500,{message:"An unknown error occurred. Please contact the developer in charge"})
        }
    }
}