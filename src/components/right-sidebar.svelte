<script lang="ts">
	import { Moon, Sun, MessageCircleQuestion, Eye } from 'lucide-svelte';
	import { toggleMode } from 'mode-watcher';

	// Remove the manual theme state management
	// let theme = $state('dark');
	// function toggleTheme() { ... }
</script>

<div class="w-[72px] border-l border-sidebar-border flex flex-col h-full">
	<!-- Only show these buttons on desktop since we have mobile bottom nav -->
	<div class="hidden md:flex flex-col items-center gap-4 p-4">
		<button class="p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/70">
			<MessageCircleQuestion class="w-6 h-6" />
		</button>

		<button class="p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/70 relative" onclick={toggleMode}>
			<div class="relative">
				<Sun class="w-6 h-6 transition-all dark:scale-0" />
				<Moon class="absolute top-0 left-0 w-6 h-6 transition-all scale-0 dark:scale-100" />
			</div>
			<span class="sr-only">Toggle theme</span>
		</button>
	</div>

	<!-- Logo at bottom -->
	<div class="hidden md:block mt-auto mb-4">
		<button class="p-2 rounded-lg hover:bg-sidebar-accent">
			<img src="/litcode_main_logo.png" alt="LitCode" class="w-auto h-8 dark:hidden" />
			<img src="/litcode_main_invert_logo.png" alt="LitCode" class="w-auto h-8 hidden dark:block" />
		</button>
	</div>
</div>
