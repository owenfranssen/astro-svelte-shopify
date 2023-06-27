<script>
import {onMount} from 'svelte';

export let title;
export let limit;
let posts = [],
	username = '';

onMount( async () => {
	posts = await fetch('/api/instagram-feed', {
			method: 'POST'
		})
		.then((res) => res.json())
		.then((json) => json.data);
	username = posts[0]?.username;
});
</script>

<section>
  <div class="bg-white">
    <div class="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <h2 class="text-2xl font-extrabold tracking-tight text-gray-900">{ title }</h2>
        <a href="https://instagram.com/{username}" class="hidden text-sm font-medium text-primary hover:text-indigo-500 md:block">Follow us<span aria-hidden="true"> &rarr;</span></a>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
				{#each posts.slice(0, limit) as post}
					<div class="mt-4 ml-8 flex flex-grow flex-shrink-0 justify-center lg:flex-grow-0 lg:ml-4">
						<a href="{post.permalink}">
							{#if post.media_type == "VIDEO"}
								<video playsinline="playsinline" preload="metadata" poster={post.thumbnail_url} class="w-full h-full object-center object-cover">
									<source src={post.media_url} type="">
									<img src={post.thumbnail_url} alt="..." />
									<track kind="captions">
								</video>
							{:else}
								<img src={post.media_url} alt="..." class="w-full h-full object-center object-cover" />
							{/if}
						</a>
					</div>
				{/each}
      </div>

      <div class="mt-8 text-sm md:hidden">
        <a href="https://instagram.com/{username}" class="font-medium text-primary hover:text-indigo-500">Follow us<span aria-hidden="true"> &rarr;</span></a>
      </div>
    </div>
  </div>
</section>
