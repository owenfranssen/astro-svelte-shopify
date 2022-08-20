<script>
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  const dispatch = createEventDispatcher();

  export let type = "error";
  export let dismissible = true;
</script>

<div class="max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5" role="alert" transition:fade>
  <div class="w-0 flex-1 p-4">
    <div class="flex items-start">
      {#if type === "success" || type === "cart"}
        <div class="flex-shrink-0">
          <!-- Heroicon name: outline/check-circle -->
          <svg class="h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      {/if}
      <div class="ml-3 w-0 flex-1 pt-0.5">
        <p class="text-sm font-medium text-gray-900"><slot /></p>
        <!-- <p class="mt-1 text-sm text-gray-500">Anyone with a link can now view this file.</p> -->
      </div>
      {#if dismissible}
        <div class="ml-4 flex-shrink-0 flex">
          <button type="button" class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" on:click={() => dispatch("dismiss")}>
            <span class="sr-only">Close</span>
            <!-- Heroicon name: solid/x -->
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      {/if}
    </div>
  </div>

  {#if type === "cart"}
    <div class="flex border-l border-gray-200">
      <button type="button" class="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" data-drawer-control="mini-cart">Open cart</button>
    </div>
  {/if}
</div>
