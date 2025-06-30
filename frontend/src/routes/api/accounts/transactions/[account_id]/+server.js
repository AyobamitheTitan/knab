import { json } from "@sveltejs/kit";
import { config } from "dotenv";

config()
/**
 * Returns the three most recent transactions on an account
 */
export async function GET({params, url}) {
    const SERVER_URL = process.env.SERVER_URL
    
    if (!SERVER_URL) {
        return json(null)
        // return fail(500, { message: "SERVER_URL not set. Please contact the developer in charge", error: true })
    }

    const transactionHistory = await fetch(SERVER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `
                query History($historyDTO: AccountHistoryDTO!) {
                    history(historyDTO: $historyDTO) {
                        amount
                        account_id
                        type
                        status
                    }
                }
            `,
            variables: {
                historyDTO:{
                    id: params.account_id,
                    limit: Number(url.searchParams.get("limit")) || 3
                }
            }
        })
    })

    const response = await transactionHistory.json()

    if (!transactionHistory.ok) {
        return json(null)
        // return fail(transactionHistory.status, { error: true, message: "An unknown error has occurred." })
    }

    
    if (response.errors) {
        return json(null)
        // return fail(response.errors[0].extensions.statusCode, { message: response.errors[0].message, error: true })   
    }else{
        return json(response.data.history)
        // return {account: response.data.history, error: false, message:null}
    }
}