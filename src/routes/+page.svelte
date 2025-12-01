<script lang="ts">
  import type { LayoutData } from './$types';

  let {data}: {data: LayoutData} = $props();  
  
</script>


<!-- <h1>{data.data. ? 'Already logged in' : 'Not logged in'}</h1> -->
<h1>
  Welcome to SvelteKit!
  {data.user ? `Logged in as ${data.user.role}` : 'Not logged in'}
</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
