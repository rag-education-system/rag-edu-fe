<script module lang="ts" >
   import { Button } from '$lib/components/ui/button';
  import {
    FormField,
    FormControl,
    FormLabel,
    FormFieldErrors,
    FormDescription
  } from '$lib/components/ui/form';
</script>


<script lang='ts'>
	import { superForm } from "sveltekit-superforms";
	import type { PageData } from "./$types";
	import { zod4 } from "sveltekit-superforms/adapters";
	import { getMessageForm } from '$lib/utils/message';
	import { loginSchema } from '$lib/zod4_schema/auth';
  

 let {data}: {data: PageData} = $props();

 const form = superForm(data.form, {
  validators:  zod4(loginSchema),
  onError({result}) {
    console.log("Form error:", result);
  },
  timeoutMs: 8000,
  dataType: 'json',
  multipleSubmits: 'prevent'
 });


 const {form: formData, enhance, message} = form;

</script>


<div class="flex min-h-screen items-center justify-center bg-background">
  <div class="w-full max-w-md space-y-6 rounded-lg border border-border p-8">
    <div class="space-y-2 text-center">
      <h1 class="text-3xl font-bold">Login</h1>
      <p class="text-muted-foreground">
        Login to RAG Education System
      </p>
    </div>

    {#if $message}
      <div class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
        {$message}
      </div>
    {/if}

    <form method="POST" use:enhance class="space-y-4">
       <FormField {form} name="email">
   {#snippet children({ constraints, errors, tainted, value })}
     <FormControl>
       {#snippet children({ props })}
         <FormLabel>Email</FormLabel>
         <input
           type="email"
           {...props}
           bind:value={$formData.email}
           placeholder="student@example.com"
           class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none ring-ring/50 transition-colors placeholder:text-muted-foreground focus:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
         />
       {/snippet}
     </FormControl>
     <FormFieldErrors />
   {/snippet}
 </FormField>

      <FormField {form} name="password">
        {#snippet children({ constraints, errors, tainted, value })}
          <FormControl>
            {#snippet children({ props })}
              <FormLabel>Password</FormLabel>
              <input
                type="password"
                {...props}
                bind:value={$formData.password}
                placeholder="••••••••"
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none ring-ring/50 transition-colors placeholder:text-muted-foreground focus:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
              />
            {/snippet}
          </FormControl>
          <FormFieldErrors />
        {/snippet}
      </FormField>

      <Button type="submit" class="w-full">
        Login
      </Button>

      <p class="text-center text-sm text-muted-foreground">
        Don't have an account?
        <a href="/auth/register" class="text-primary underline-offset-4 hover:underline">
          Register here
        </a>
      </p>
    </form>
  </div>
</div>


