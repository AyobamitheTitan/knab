<script>
    import { enhance } from "$app/forms";

    let visibile = $state(false);

    let errorMessage = $state(null);    
    const {account_id} = $props()
</script>

<div>
    <button
        onclick={() => {
            visibile = true;
        }}
        class="mt-4 p-2 text-sm text-gray-900 rounded w-fit underline">Set pin</button
    >

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
                                    Set transaction pin
                                </h3>
                                <div class="mt-2 flex flex-col">
                                    <form
                                        method="POST"
                                        ,
                                        use:enhance={() =>
                                            ({ result, update }) => {
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
                                        <input
                                            name="pin"
                                            class="rounded-sm border w-50 h-7 outline-slate-800 px-3 my-2"
                                            type="password"
                                            placeholder="pin"
                                        />
                                        <input
                                            name="confirm_pin"
                                            type="password"
                                            placeholder="Confirm pin"
                                            maxlength="4"
                                            class="rounded-sm border px-3 h-7 w-50  outline-slate-800"
                                        />
                                        <input type="text" name="account_id" class="hidden" value={account_id}>
                                        <div
                                            class="px-4 py-3 sm:flex sm:justify-center sm:px-6"
                                        >
                                            <button
                                                type="submit"
                                                class="mr-2 inline-flex w-full justify-center rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-slate-500 sm:ml-3 sm:w-auto"
                                                >Proceed</button
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
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
