<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import {
		MessageSquare,
		UsersRound,
		FileCode2,
		History,
		Search,
		Plus,
		LogOut,
		Crown,
		Menu
	} from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { isMobileSidebarOpen } from '$lib/stores/ui';
	import { chatStore } from '$lib/stores/chat';

	const menuItems = [
		{ icon: MessageSquare, label: 'Chat-Bot (General)', active: true, href: '#' },
		{ icon: UsersRound, label: 'Community', href: '#' },
		{ icon: FileCode2, label: 'Templates', href: '#' },
		{ icon: History, label: 'History', href: '#' }
	];

	function closeMobileSidebar() {
		isMobileSidebarOpen.set(false);
	}

	function createNewChat() {
		chatStore.createNewTab();
		closeMobileSidebar();
	}

	function selectChat(id: string) {
		chatStore.setActiveTab(id);
		closeMobileSidebar();
	}

	function deleteChat(id: string) {
		chatStore.deleteTab(id);
	}
</script>

{#if $isMobileSidebarOpen}
	<button 
		class="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
		onclick={closeMobileSidebar}
		type="button"
		aria-label="Close sidebar"
	></button>
{/if}

<Sidebar.Root
	class={cn(
		"bg-background text-foreground w-[280px] flex flex-col border-r border-sidebar-border",
		"fixed md:static z-50 transition-transform duration-300",
		"h-screen overflow-hidden",
		$isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
	)}
	collapsible="none"
>
	<Sidebar.Header class="p-4 md:p-8 flex-shrink-0">
		<div class="flex items-center gap-4 px-2 py-2">
			<a href="/" data-sveltekit-reload class="w-[160px] md:w-[200px] flex">
				<img src="/litcode_logo_dark.png" alt="LitCode Logo" class="h-12 md:h-16 dark:hidden w-full object-contain" />
				<img src="/litcode_logo.png" alt="LitCode Logo" class="h-12 md:h-16 hidden dark:block w-full object-contain" />
			</a>
			<div class="ml-auto mr-2">
				<button class="p-1 hover:bg-sidebar-accent rounded">
					<LogOut class="w-5 h-5 md:w-6 md:h-6" />
				</button>
			</div>
		</div>
	</Sidebar.Header>

	<Sidebar.Content class="flex-1 px-3 overflow-y-auto scrollbar-none">
		<div class="space-y-1">
			{#each menuItems as item}
				<a
					href={item.href}
					class={cn(
						'w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent',
						item.active && 'bg-sidebar-accent'
					)}
				>
					<svelte:component this={item.icon} class="w-5 h-5" />
					<span>{item.label}</span>
				</a>
			{/each}
		</div>

		<div class="mt-3">
			<div class="relative">
				<Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
				<input
					type="text"
					placeholder="Search"
					class="w-full bg-sidebar-accent rounded-lg pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
				/>
			</div>
		</div>

		<button
			class="w-full flex items-center gap-3 px-3 py-2 mt-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
		>
			<Plus class="w-5 h-5" />
			<span>New Chat</span>
		</button>

		<div class="mt-4 space-y-1">
			{#each $chatStore.tabs as tab}
				<div 
					class={cn(
						'w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent cursor-pointer group',
						tab.id === $chatStore.activeTabId && 'bg-sidebar-accent'
					)}
					onclick={() => selectChat(tab.id)}
					onkeydown={(e) => e.key === 'Enter' && selectChat(tab.id)}
					role="button"
					tabindex="0"
				>
					<MessageSquare class="w-5 h-5" />
					<span class="flex-1 text-left truncate">{tab.title}</span>
					{#if $chatStore.tabs.length > 1}
						<button 
							class="opacity-0 group-hover:opacity-100 hover:text-destructive"
							onclick={(e) => {
								e.stopPropagation();
								deleteChat(tab.id);
							}}
						>
							×
						</button>
					{/if}
				</div>
			{/each}
		</div>
	</Sidebar.Content>

	<div class="flex-shrink-0 mt-auto p-3 border-t border-sidebar-border">
		<div class="flex flex-col gap-3 p-4">
			<div class="flex items-center gap-3">
				<Avatar.Root class="h-9 w-9">
					<Avatar.Image src="/placeholder.svg" alt="Profile picture" />
					<Avatar.Fallback>KN</Avatar.Fallback>
				</Avatar.Root>
				<div class="flex flex-col flex-1 min-w-0">
					<span class="text-sm font-medium leading-none">User</span>
					<span class="text-xs text-muted-foreground truncate">user@example.com</span>
				</div>
			</div>
			<Button variant="secondary" size="sm" class="h-8 gap-1.5">
				<Crown class="w-3.5 h-3.5 text-yellow-500" />
				<span>Upgrade</span>
			</Button>
		</div>
	</div>
</Sidebar.Root>
