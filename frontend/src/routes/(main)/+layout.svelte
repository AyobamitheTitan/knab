<script>
    import Sidebar from "../../components/Sidebar.svelte";

    import Dashboard from '../../components/Dashboard.svelte';
    import { page } from "$app/stores";

    const {data} = $props()
    
    const account = data.account
</script>

<Sidebar >

{#if $page.url.pathname !== "/settings"}
<Dashboard {account}/>
    
{/if}

<slot></slot>

</Sidebar>