<script>
    import { enhance } from "$app/forms";
    import { validateInputField } from "../../../utils/index";


    let errorMessage = $state(null)
    const inputFields = $state([
        {
            type: "text",
            name: "Phone Number",
            placeholder: "Phone number",
            value: "",
            error: "",
        },
        {
            type: "text",
            name: "Email",
            placeholder: "Email",
            value: "",
            error: "",
        },
        {
            type: "text",
            name: "First Name",
            placeholder: "First Name",
            value: "",
            error: "",
        },
        {
            type: "text",
            name: "Last Name",
            placeholder: "Last Name",
            value: "",
            error: "",
        },
        {
            type: "password",
            name: "Password",
            placeholder: "Password",
            value: "",
            error: "",
        },
        { type: "date", name: "DOB", placeholder: "DOB", value: "", error: "" },
    ]);

    const canSubmit = $derived.by(() => {
        for (let index = 0; index < inputFields.length; index++) {
            const element = inputFields[index];

            if (element.value.length < 1 || element.error.length > 0) {
                return false;
            }
        }
        return true;
    });

    /** @satisfies {import("./$types").SubmitFunction}*/
    const handleSubmit = () => {
        return async ({ result, update, action }) => {
            if (result.type === "failure") {
                errorMessage = result.data?.message
            }
            update({ reset: false });
        };
    };
</script>

{#if errorMessage}
    <div
        class="w-72 flex justify-around transition text-sm text-center text-red-600 -mt-6 mb-2 py-4 px-3 bg-red-50 rounded-sm"
    >
        <p>{errorMessage}</p>
        <button onclick={()=>{errorMessage=null}}>X</button>
    </div>
{/if}

<h2 class="text-2xl">Create an account</h2>
<form class="flex flex-col p-4" method="POST" use:enhance={handleSubmit}>
    {#each inputFields as inputField, i}
        <input
            value={inputField.value}
            oninput={(e) => {
                inputField.value = e?.target?.value;
                inputField.error = validateInputField(
                    inputField.name,
                    inputField.value,
                );
            }}
            name={inputField.name}
            class={`py-3 px-6 w-72 m-[0.6rem] bg-slate-100 rounded-lg outline-blue-500 ${inputField.error && "border-red-600 outline-red-600"}`}
            type={inputField.type}
            placeholder={inputField.placeholder}
        />
        {#if inputField.error}
            <span class="text-red-600 text-xs mx-2 w-72"
                >{inputField.error}</span
            >
        {/if}
    {/each}
    <button
        class={`mt-14 bg-slate-950 text-white p-4 rounded-full cursor-pointer transition-transform duration-200 hover:scale-x-110 hover:bg-slate-800 disabled:bg-slate-500 disabled:hover:scale-100 disabled:cursor-auto`}
        type="submit"
        disabled={!canSubmit}
    >
        Create Account
    </button>
</form>
<p><a href="/login" class="hover:underline">Already have an account? Login</a></p>
