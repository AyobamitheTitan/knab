<script>
	import { page } from '$app/state';
</script>

<h1>{page.status}: {page?.error.message}</h1>