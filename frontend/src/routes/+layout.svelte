<script>
    import "../app.css";
    import { page } from "$app/stores";

    const nonAuthenticatedRoutes = ["/login", "/signup"];
    console.log($page.url.pathname)
</script>

{#if nonAuthenticatedRoutes.includes($page.url.pathname) || $page.url.pathname === "/"}
    <nav class="flex justify-center text-3xl p-2 bg-slate-50">
        <h1>KNAB&trade;</h1>
    </nav>
{/if}
<slot></slot>
