<script>
    import { onMount } from "svelte";
    import NewTransactionPopup from "../../../components/NewTransactionPopup.svelte";
    import TransactionHistoryTable from "../../../components/TransactionHistoryTable.svelte";

    const { data } = $props();
    /**@type {TransactionHistory[]} history*/
    let history = $state([]);

    onMount(async () => {
        const transactionHistory = await fetch(
            `/api/accounts/transactions/${data.account._id}?limit=100`,
        );
        const response = await transactionHistory.json();
        if (transactionHistory.ok) {
            history = response;
        }
    });
</script>

<NewTransactionPopup account_id={data.account._id} route="transactions"/>
<div class="sm:px-20 px-2 flex flex-col">
    {#if history.length == 0}
        <div
            class="flex flex-col py-3 text-center justify-center items-center"
        >
            No data to show
        </div>
    {:else}
        <TransactionHistoryTable {history} />
    {/if}
</div>