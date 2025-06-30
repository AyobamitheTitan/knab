<script>
    let { account } = $props();
</script>

<main class="flex flex-col sm:p-20 py-20 px-5 font-work-sans">
    <div class="flex justify-between items-center">
        <h2 class="font-semibold text-2xl py-4">Dashboard</h2>
        <div class="flex bg-slate-50 h-9 px-4 items-center rounded-lg">
            Hi, {account.account_user_name.split(" ")[0]}
        </div>
    </div>
    <div
        class="bg-slate-200 w-full h-full sm:px-16 py-7 px-4 rounded-xl flex justify-between"
    >
        <div>
            <p class="text-sm py-4">{account.account_number}</p>
            <div class="flex items-center">
                <div class="text-slate-950 text-2xl">&#8358;</div>
                <p class="text-4xl">{account.balance}</p>
            </div>
        </div>
        <div class="py-5 flex">
            Tier:&nbsp;
            <div class="font-semibold">{account.tier}</div>
        </div>
    </div>

    
</main>
