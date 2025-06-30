import { fail, redirect } from '@sveltejs/kit'
import { config } from 'dotenv'

config()

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
    let session = cookies.get("session")
    const SERVER_URL = process.env.SERVER_URL

    if (!SERVER_URL) {
        return fail(500, { message: "SERVER_URL not set. Please contact the developer in charge", error: true })
    }

    if (!session) {
        redirect(301, "/login")
    }
    const session_generated = cookies.get("session-generated")
    if (!session_generated) {
        redirect(301, "/login")
    }
    const shouldTokenRefresh = await shouldRefresh(session_generated)

    if (shouldTokenRefresh) {
        session = await getRefreshToken(session, cookies)
    }

    const primaryAccount = await fetch(SERVER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `
                query PrimaryAccount($getPrimaryAccountDTO:GetUserPrimaryAccountDTO!){
                    primaryAccount(getPrimaryAccountDTO:$getPrimaryAccountDTO){
                        _id
                        balance
                        account_type
                        account_number
                        status
                        todays_spendable
                        account_user_name
                        tier
                    }
                }
            `,
            variables: {
                getPrimaryAccountDTO: {
                    token: `Bearer ${session}`
                }
            }
        })
    })

    const response = await primaryAccount.json()

    if (!primaryAccount.ok) {
        return fail(primaryAccount.status, { error: true, message: "An unknown error has occurred." })
    }

    if (response.errors) {
        return fail(response.errors[0].extensions.statusCode, { message: response.errors[0].message, error: true })
    } else {
        return { account: response.data.primaryAccount, token: session }
    }
}


/**
 * Checks if the token should be refreshed
 * Refreshes the token if it was last generated a day ago
 * 
 * @param {string} session_generated The date the token was last generated
 * stored in its ISOString format.
 * 
 * @returns {Promise<boolean>}
 */
async function shouldRefresh(session_generated) {
    const last_refreshed = new Date(session_generated)
    const today = new Date()

    if (today.getFullYear() > last_refreshed.getFullYear() || today.getMonth() > last_refreshed.getMonth() || today.getDate() > last_refreshed.getDate()) {
        return true
    }
    return false
}

/**
 * Refreshes the token everytime the user logs in
 * @param {string} token 
 * @param {import('@sveltejs/kit').Cookies} cookies 
 */
async function getRefreshToken(token, cookies) {
    const SERVER_URL = process.env.SERVER_URL


    if (!SERVER_URL) {
        return fail(500, { message: "SERVER_URL not set. Please contact the developer in charge", error: true })
    }

    const refresh = await fetch(SERVER_URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                mutation RefreshToken($refreshTokenDTO: RefreshTokenDTO!){
                    refreshToken(refreshTokenDTO: $refreshTokenDTO)
                }
            `,
            variables: {
                refreshTokenDTO: {
                    token: `Bearer ${token}`
                }
            }
        })
    })

    if (!refresh.ok) {
        return fail(refresh.status, { error: true, message: "An unknown error has occurred." })
    }

    const response = await refresh.json()

    if (response.errors) {
        redirect(301, "/login")
    } else if (response.data) {
        cookies.set("session", response.data.refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            path: "/",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 30
        })
        cookies.set("session-generated", new Date().toISOString(), {
            httpOnly: true,
            sameSite: "strict",
            path: "/",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 30
        })
    }
    return response.data.refreshToken
}