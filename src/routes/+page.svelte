<script lang="ts">
	import { onMount } from 'svelte';
	import { chatStore, type ChatMessage, type ChatTab } from '$lib/stores/chat';
	import MarkdownRenderer from '../components/markdown-renderer.svelte';
	import LeftSidebar from '../components/left-sidebar.svelte';
	import {
		MessageSquare,
		UsersRound,
		FileCode2,
		Sun,
		Moon,
		Menu,
		Brain,
		WandSparkles
	} from 'lucide-svelte';
	import ModelSelection from '../components/model-selection.svelte';
	import RightSidebar from '../components/right-sidebar.svelte';
	import PromptCard from '../components/prompt-card.svelte';
	import { toast } from 'svelte-sonner';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { toggleMode } from 'mode-watcher';
	import { isMobileSidebarOpen } from '$lib/stores/ui';
	import TypingIndicator from '../components/typing-indicator.svelte';
	import ChatInput from '../components/chat-input.svelte';

	let chatInput = $state('');
	let selectedFiles = $state<File[]>([]);
	let userIp = $state('');
	let isLoading = $state(false);

	let activeTab = $state<ChatTab | null>(null);

	$effect(() => {
		activeTab = $chatStore.tabs.find((tab) => tab.id === $chatStore.activeTabId) || null;
	});

	onMount(async () => {
		try {
			const response = await fetch('https://api.ipify.org?format=json');
			const data = await response.json();
			userIp = data.ip;
		} catch (error) {
			console.error('Error fetching IP:', error);
		}
	});

	onMount(() => {
		chatStore.setActiveTab('');
	});

	async function handleSubmit() {
		if ((!chatInput && selectedFiles.length === 0) || isLoading) return;

		// Create new tab first if none exists
		if (!activeTab) {
			chatStore.createNewTab();
			// Get the newly created active tab
			activeTab = $chatStore.tabs.find((tab) => tab.id === $chatStore.activeTabId) || null;
		}

		isLoading = true;
		const messagePayload = {
			ip_address: userIp,
			message: chatInput,
			page: $chatStore.activeTabId,
			model: $chatStore.selectedModel,
			tab_name: activeTab?.title,
			file_names: selectedFiles.map((file) => file.name)
		};

		// Add user message
		chatStore.addMessage({
			sender: 'User',
			text: chatInput,
			isCode: false,
			timestamp: new Date()
		});

		const formData = new FormData();
		formData.append('payload', JSON.stringify(messagePayload));
		selectedFiles.forEach((file) => {
			formData.append('files[]', file);
		});

		try {
			const response = await fetch(`${PUBLIC_API_URL}/chat`, {
				method: 'POST',
				body: formData
			});
			const data = await response.json();

			chatStore.addMessage({
				sender: 'AI',
				text: data.response || 'Sorry, there was an error processing your request.',
				isCode: false,
				timestamp: new Date()
			});

			if (data.tab_title) {
				chatStore.updateTabTitle(activeTab?.id ?? 'default', data.tab_title);
			}
		} catch (error) {
			console.error('Error:', error);
			toast.error('Network Error', {
				description: 'We are conducting routine site maintenance. Service will be back online soon.'
			});

			chatStore.addMessage({
				sender: 'AI',
				text: 'We are conducting routine site maintenance and updating features at LitCode by thirdeye. This service will be back online soon.',
				isCode: false,
				timestamp: new Date()
			});
		} finally {
			chatInput = '';
			selectedFiles = [];
			isLoading = false;
		}
	}

	function toggleMobileSidebar() {
		isMobileSidebarOpen.update((v) => !v);
	}

	const iconMap = {
		FileCode2,
		Brain,
		WandSparkles,
		MessageSquare
	};

	let promptCards: { iconName: string }[] = [];
	promptCards = promptCards.map((card) => ({
		...card,
		icon: iconMap[card.iconName as keyof typeof iconMap]
	}));

	function handlePromptSelect(prompt: string) {
		chatInput = prompt;
	}

	// Fetch and select 4 random prompts from engagingPrompts.txt
	let randomPrompts = $state<string[]>([]);
	onMount(async () => {
		try {
			const response = await fetch('/engaging_prompts.txt');
			const text = await response.text();
			const prompts = text.split('\n').filter(Boolean);
			randomPrompts = prompts.sort(() => 0.5 - Math.random()).slice(0, 4);
		} catch (error) {
			console.error('Error fetching prompts:', error);
		}
	});
</script>

<div class="flex h-screen bg-background">
	<!-- Left Sidebar - Now visible on mobile when toggled -->
	<LeftSidebar />

	<!-- Main Content -->
	<main class="flex-1 flex flex-col h-[calc(100%-4rem)] relative">
		<!-- Top Bar with gradient background -->
		<div class="h-14 border-b border-border flex items-center px-2 md:px-4 py-8">
			<!-- Add hamburger menu button -->
			<button class="md:hidden p-2 hover:bg-muted rounded-lg" onclick={toggleMobileSidebar}>
				<Menu class="w-6 h-6" />
			</button>

			<div class="flex-1 flex justify-center items-center px-2">
				<ModelSelection />
			</div>
		</div>

		<!-- Chat Area with Centered Logo -->
		<div class="flex-1 overflow-hidden flex flex-col items-center w-full">
			<div
				class="h-full w-full max-w-[1200px] px-6 md:px-8 pb-[100px] md:pb-24 overflow-y-auto
				scrollbar-thin scrollbar-thumb-scrollbar-thumb scrollbar-track-scrollbar-track
				hover:scrollbar-thumb-muted"
			>
				{#if !activeTab || activeTab.messages.length === 0}
					<!-- Ensure full height and proper centering -->
					<div class="h-full w-full flex items-center justify-center">
						<div class="flex flex-col items-center">
							<img
								src="/litcode_main_logo.png"
								alt="LitCode"
								class="h-24 md:h-36 mb-8 object-contain dark:hidden"
							/>
							<img
								src="/litcode_main_invert_logo.png"
								alt="LitCode"
								class="h-24 md:h-36 mb-8 object-contain hidden dark:block"
							/>

							<!-- Prompt Cards -->
							<div class="w-full grid grid-cols-2 gap-4">
								{#each randomPrompts as prompt}
									<PromptCard
										title={prompt}
										description={prompt}
										prompt={prompt}
										icon={MessageSquare}
										onSelectPrompt={handlePromptSelect}
									/>
								{/each}
							</div>
						</div>
					</div>
				{:else}
					<!-- Chat messages -->
					<div class="space-y-4 py-4">
						{#each activeTab?.messages ?? [] as message}
							<div class="flex gap-3 {message.sender === 'User' ? 'justify-end' : 'justify-start'}">
								<div
									class="max-w-[80%] {message.sender === 'User'
										? 'bg-primary text-primary-foreground'
										: 'bg-muted'} rounded-lg px-4 py-2"
								>
									{#if message.isCode}
										<MarkdownRenderer content={message.text} />
									{:else}
										<p class="whitespace-pre-wrap">{message.text}</p>
									{/if}
								</div>
							</div>
						{/each}

						<!-- Show typing indicator immediately after user's message while loading -->
						{#if isLoading && activeTab?.messages?.length > 0 && activeTab.messages[activeTab.messages.length - 1].sender === 'User'}
							<div class="flex gap-3 justify-start">
								<TypingIndicator />
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<!-- Input Area - Positioned above mobile nav -->
		<ChatInput bind:chatInput bind:selectedFiles {isLoading} {handleSubmit} />
	</main>

	<!-- Right Sidebar - Hidden on mobile -->
	<div class="hidden md:block">
		<RightSidebar />
	</div>

	<!-- Mobile Bottom Navigation -->
	<div
		class="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around items-center p-3 z-50"
	>
		<button class="p-2 hover:bg-muted rounded-lg">
			<MessageSquare class="w-6 h-6" />
		</button>
		<button class="p-2 hover:bg-muted rounded-lg">
			<UsersRound class="w-6 h-6" />
		</button>
		<button class="p-2 hover:bg-muted rounded-lg">
			<FileCode2 class="w-6 h-6" />
		</button>
		<button class="p-2 hover:bg-muted rounded-lg" onclick={toggleMode}>
			<Sun class="w-6 h-6 dark:hidden" />
			<Moon class="w-6 h-6 hidden dark:block" />
		</button>
	</div>
</div>
