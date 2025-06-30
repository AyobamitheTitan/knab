<script>
    import { enhance } from "$app/forms";
    import { redirect } from "@sveltejs/kit";

    let visibile = $state(false);

    const { account_id, route } = $props();
    let errorMessage = $state(null);
</script>

<div>
    {#if route === "transactions"}
        <div class="flex justify-between px-20">
            <div></div>
            <button
                onclick={() => {
                    visibile = true;
                }}
                class="px-4 py-3 mb-4 text-sm text-gray-950 bg-slate-500 rounded-3xl w-fit hover:bg-slate-400"
                >New transaction</button
            >
        </div>
    {:else}
        <button
            onclick={() => {
                visibile = true;
            }}
            class="mt-4 px-4 py-3 text-sm text-gray-950 bg-slate-500 rounded-3xl w-fit hover:bg-slate-400"
            >Make a new transaction</button
        >
    {/if}

    <div
        class={`${visibile ? "relative" : "hidden"} z-10`}
        aria-labelledby="dialog-title"
        role="dialog"
        aria-modal="true"
    >
        <div
            class="fixed inset-0 bg-gray-500/75 transition-opacity"
            aria-hidden="true"
        ></div>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div
                class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
            >
                <div
                    class="relative transform overflow-hidden rounded-lg bg-white text-center shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                >
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div>
                            <div>
                                <h3
                                    class="text-base font-semibold text-gray-900"
                                    id="dialog-title"
                                >
                                    New transaction
                                </h3>
                                <div class="mt-2">
                                    <form
                                        method="POST"
                                        ,
                                        use:enhance={() =>
                                            ({ result, update }) => {
                                                if (result.type === "success") {
                                                    visibile = false
                                                }
                                                errorMessage =
                                                    result?.data.message;
                                                update({ reset: false });
                                            }}
                                    >
                                        {#if errorMessage}
                                            <div
                                                class="text-sm text-red-600 py-4"
                                            >
                                                {errorMessage}
                                            </div>
                                        {/if}
                                        {#if errorMessage === "Account pin has not been set"}
                                            <a
                                                href="/settings"
                                                class="text-sm hover:underline py-1"
                                                >Set your pin</a
                                            >
                                        {/if}

                                        <select
                                            name="transaction_type"
                                            class="rounded-sm border w-full h-7 outline-slate-800 px-3"
                                            id=""
                                        >
                                            <option value="WITHDRAW"
                                                >WITHDRAW</option
                                            >
                                            <option value="DEPOSIT"
                                                >DEPOSIT</option
                                            >
                                        </select>
                                        <input
                                            name="amount"
                                            class="rounded-sm border w-full h-7 outline-slate-800 px-3 my-2"
                                            type="number"
                                            placeholder="Amount"
                                        />
                                        <textarea
                                            name="description"
                                            maxlength="300"
                                            placeholder="Description"
                                            class="rounded-sm border w-full my-2 px-3 outline-slate-800"
                                        ></textarea>
                                        <input
                                            name="pin"
                                            type="password"
                                            placeholder="Pin"
                                            maxlength="4"
                                            class="rounded-sm border px-3 flex h-7 w-20 items-start outline-slate-800"
                                        />
                                        <input
                                            type="text"
                                            class="hidden"
                                            name="account_id"
                                            value={account_id}
                                        />
                                        <button
                                            type="submit"
                                            class="mr-2 inline-flex w-full justify-center rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-slate-500 sm:ml-3 sm:w-auto"
                                            >Proceed</button
                                        >
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class="bg-gray-50 px-4 py-3 sm:flex sm:justify-center sm:px-6"
                    >
                        <button
                            onclick={() => {
                                visibile = false;
                            }}
                            type="button"
                            class="mt-3 ml-2 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            >Cancel</button
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
