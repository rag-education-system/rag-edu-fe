<script lang='ts'>
   import { Button } from '$lib/components/ui/button';
  import {
    FormField,
    FormControl,
    FormLabel,
    FormFieldErrors
  } from '$lib/components/ui/form';
	import { registerSchema } from "$lib/zod4_schema/auth";
	import { toast } from "svelte-sonner";
	import { superForm } from "sveltekit-superforms";
	import { zod4 } from "sveltekit-superforms/adapters";

  let {data}: {data: any} = $props();

  const form = superForm(data.form, {
    validators:  zod4(registerSchema),
    onSubmit() {
      // console.log('[REGISTER FORM] Submitting...');
      toast.loading("Submitting registration...");
    },
    onError({result}) {
      // console.error('[REGISTER FORM] Error:', result.error);
      toast.error("Form error: " + JSON.stringify(result.error));
    },
    onUpdated({form}) {
      if(form.message && !form.valid) {
        toast.error(form.message.message || 'Registration failed');
      }
    },
    dataType: 'json',
    multipleSubmits: 'prevent'
  })

  const {form: formData, enhance, message} = form;

</script>



<div class="flex min-h-screen items-center justify-center bg-background">
  <div class="w-full max-w-md space-y-6 rounded-lg border border-border p-8">
    <div class="space-y-2 text-center">
      <h1 class="text-3xl font-bold">Register</h1>
      <p class="text-muted-foreground">
        Create a new account
      </p>
    </div>

    {#if $message}
      <div class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
        <p class="font-semibold">Registration Error:</p>
        {#if typeof $message === 'object'}
          <p>{$message.message || JSON.stringify($message)}</p>
        {:else}
          <p>{$message}</p>
        {/if}
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
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none ring-ring/50 transition-colors placeholder:text-muted-foreground focus:ring-[3px]"
              />
            {/snippet}
          </FormControl>
          <FormFieldErrors />
        {/snippet}
      </FormField>

      <FormField {form} name="name">
        {#snippet children({ constraints, errors, tainted, value })}
          <FormControl>
            {#snippet children({ props })}
              <FormLabel>Nama Lengkap</FormLabel>
              <input
                type="text"
                {...props}
                bind:value={$formData.name}
                placeholder="John Doe"
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none ring-ring/50 transition-colors placeholder:text-muted-foreground focus:ring-[3px]"
              />
            {/snippet}
          </FormControl>
          <FormFieldErrors />
        {/snippet}
      </FormField>

      <FormField {form} name="major">
        {#snippet children({ constraints, errors, tainted, value })}
          <FormControl>
            {#snippet children({ props })}
              <FormLabel>Jurusan</FormLabel>
              <input
                type="text"
                {...props}
                bind:value={$formData.major}
                placeholder="e.g., ptik, ti, si"
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none ring-ring/50 transition-colors placeholder:text-muted-foreground focus:ring-[3px]"
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
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none ring-ring/50 transition-colors placeholder:text-muted-foreground focus:ring-[3px]"
              />
            {/snippet}
          </FormControl>
          <FormFieldErrors />
        {/snippet}
      </FormField>

      <Button type="submit" class="w-full">
        Create Account
      </Button>

      <p class="text-center text-sm text-muted-foreground">
        Already have an account?
        <a href="/auth/login" class="text-primary underline-offset-4 hover:underline">
          Login here
        </a>
      </p>
    </form>
  </div>
</div>