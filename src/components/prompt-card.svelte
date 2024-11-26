<script lang="ts">
	import { Eye } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';

	let { 
		title = "Fill out your vision",
		description = "Ask me any thing you need guidance on...",
		prompt = "ipsum dolor sit amet consectetur. Euismod porttitor dignissim",
		icon = Eye,
		onSelectPrompt
	} = $props();

	function handleClick() {
		onSelectPrompt?.(prompt);
	}
</script>

<Card.Root class="cursor-pointer hover:opacity-90 transition-opacity" onclick={handleClick}>
	<Card.Content class="p-4 md:p-6 space-y-3 md:space-y-4 bg-muted">
		<div class="flex items-center gap-2 md:gap-3">
			<div class="p-1.5 md:p-2 rounded-lg bg-primary-foreground">
				<svelte:component this={icon} class="w-4 h-4 md:w-5 md:h-5 text-foreground" />
			</div>
			<Card.Title class="text-sm md:text-base">{title}</Card.Title>
		</div>
	</Card.Content>
</Card.Root>
