<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { chatStore } from '$lib/stores/chat';

	const models = [
		{ value: 'litchat superbasic', label: 'llama3.2 (fastest general chat)', enabled: true },
		{ value: 'litchat basic', label: 'llama3.1 (general chat)', enabled: true },
		{ value: 'basic', label: 'mixtral (basic coding)', enabled: true },
		{ value: 'qwen2-math', label: 'Qwen2 Math (fast math)', enabled: true },
		{ value: 'advanced', label: 'deepseek-coderv2 (premium coding)', enabled: true },
		{ value: 'litchat premium', label: 'LitChat Premium (general chat)', enabled: true },
		{ value: 'nemotron-mini', label: "NVIDIA's nemotron-mini (fast)", enabled: true },
		{ value: 'gemma', label: "Google's gemma (fast)", enabled: true },
		{ value: 'phi3.5', label: 'phi3.5 (fast coding)', enabled: true },
		{ value: 'hermes3', label: 'Hermes3 (general chat)', enabled: true },
		{ value: 'solar-pro', label: 'Advanced Solar-Pro (slowest)', enabled: true }
	];

	// Subscribe to the store value
	let selectedModel: string;
	chatStore.subscribe(store => {
		selectedModel = store.selectedModel;
	});

	$: triggerContent = models.find((m) => m.value === selectedModel)?.label ?? 'Select a model';
</script>

<Select.Root 
	type="single" 
	value={selectedModel}
	onValueChange={(value) => chatStore.setModel(value)}
>
	<Select.Trigger
		class="bg-sidebar text-sidebar-foreground px-3 md:px-6 py-2 md:py-2.5 rounded-full flex items-center gap-2 w-fit border-none focus:ring-0 focus:ring-offset-0 text-base md:text-lg truncate max-w-[250px] md:max-w-[400px]"
	>
		{triggerContent}
	</Select.Trigger>
	<Select.Content class="bg-sidebar text-sidebar-foreground border-sidebar-border border rounded-lg text-base md:text-lg">
		<Select.Group>
			{#each models as model}
				<Select.Item
					value={model.value}
					disabled={!model.enabled}
					label={model.label}
					class="hover:bg-sidebar-accent"
				>
					<div class="flex items-center gap-2">
						{model.label}
						{#if !model.enabled}
							<span class="text-xs text-muted-foreground">(coming soon)</span>
						{/if}
					</div>
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
