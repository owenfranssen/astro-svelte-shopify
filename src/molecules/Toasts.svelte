<script>
  import Toast from "./Toast.svelte";

  import { dismissToast, toasts } from "../assets/scripts/stores.js";
</script>

{#if $toasts}
  <div aria-live="assertive" class="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start" data-toast>
    <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
      <!--
        Notification panel, dynamically insert this into the live region when it needs to be displayed

        Entering: "transform ease-out duration-300 transition"
          From: "translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          To: "translate-y-0 opacity-100 sm:translate-x-0"
        Leaving: "transition ease-in duration-100"
          From: "opacity-100"
          To: "opacity-0"
      -->
      {#each $toasts as toast (toast.id)}
        <Toast
          type={toast.type}
          dismissible={toast.dismissible}
          on:dismiss={() => dismissToast(toast.id)}>{toast.message}</Toast
        >
      {/each}
    </div>
  </div>
{/if}
