import { fail, json, redirect } from '@sveltejs/kit'

export const actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData()
        const SERVER_URL = process.env.SERVER_URL
        const session = cookies.get("session")

        if (!session) {
            redirect(301, "/login")
        }
        if (!SERVER_URL) {
            return fail(500, { message: "SERVER_URL not set. Please contact the developer in charge", error: true })
        }

        const setPin = await fetch(SERVER_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session}`
            },
            body: JSON.stringify({
                query: `
                    mutation SetAccountPin($setAccountPinDTO: SetAccountPinDTO!) {
                        setPin(setPinDTO: $setAccountPinDTO) {
                            account_number
                            _id
                        }
                    },
                `,
                variables: {
                    setAccountPinDTO: {
                        account_id: formData.get("account_id"),
                        confirmPin: formData.get("confirm_pin"),
                        pin: formData.get("pin")
                    }
                }
            })
        })

        if (!setPin.ok) {
            console.log(await setPin.json());

            return fail(setPin.status, { error: true, message: "An unknown error has occurred." })
        }
        const response = await setPin.json()


        if (response.errors) {
            return fail(response.errors[0].extensions.statusCode, { message: response.errors[0].message, error: true })
        } else if (response.data) {
            return json(response.data)
        } {
            return fail(500, { message: "An unknown error occurred. Please contact the developer in charge" })
        }
    }
}