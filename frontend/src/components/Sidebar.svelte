<script>
    const sidebarElements = [
        { name: "Dashboard", href: "dashboard" },
        { name: "Transactions", href: "transactions" },
        { name: "Settings", href: "settings" },
    ];

    let visibile = false;
</script>

<div class="flex md:flex-row flex-col">

    <div
        class={`
            z-50 
            bg-slate-400 
            font-work-sans 
            text-xl text-slate-900 
            w-60
            h-screen 
            transition-transform duration-300 
            fixed right-0 top-0 
            ${visibile ? 'translate-x-0' : 'translate-x-full'} 
            md:translate-x-0 
            md:relative md:block
        `}
    >
        <!-- Close button on mobile -->
        <div class="flex justify-end p-4 md:hidden">
            <button onclick={() => (visibile = false)}>
                <span class="material-symbols-outlined"> close </span>
            </button>
        </div>

        <!-- Sidebar nav -->
        <aside class="pt-24 px-7">
            <ul>
                {#each sidebarElements as element}
                    <li class="p-4">
                        <a href="/{element.href}">{element.name}</a>
                    </li>
                {/each}
            </ul>
        </aside>
    </div>

    {#if visibile}
        <div 
            class="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
            onclick={() => (visibile = false)}
        ></div>
    {/if}

    <div class="flex-1 p-8">
        <button 
            class="hover:cursor-pointer md:hidden mb-4 z-50"
            onclick={() => (visibile = !visibile)}
        >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
                <path d="M120-680v-80h720v80H120Zm0 480v-80h720v80H120Zm0-240v-80h720v80H120Z"/>
            </svg>
        </button>
<slot/>
    </div>
</div>