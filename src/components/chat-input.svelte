<script lang="ts">
    import { Paperclip, Mic, Send } from 'lucide-svelte';
    import { toast } from "svelte-sonner";
    
    export let chatInput: string;
    export let isLoading: boolean;
    export let selectedFiles: File[];
    export let handleSubmit: () => void;
    
    let audioRecorder: MediaRecorder | null = null;

    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioRecorder = new MediaRecorder(stream);
            const audioChunks: BlobPart[] = [];

            audioRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            audioRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks);
                selectedFiles = [...selectedFiles, new File([audioBlob], 'voice-message.wav')];
            };

            audioRecorder.start();
        } catch (error) {
            console.error('Error starting recording:', error);
            toast.error("Recording Error", {
                description: "Unable to access microphone. Please check your permissions.",
            });
        }
    }

    function stopRecording() {
        if (audioRecorder) {
            audioRecorder.stop();
            audioRecorder = null;
        }
    }
</script>

<div class="fixed bottom-[4.5rem] md:bottom-0 left-0 right-0 w-full p-2 md:p-4 border-t bg-background flex justify-center">
    <div class="w-full max-w-[1200px] px-6 md:px-8">
        {#if selectedFiles.length > 0}
            <div class="mb-2 space-y-2">
                {#each selectedFiles as file, index}
                    <div class="flex items-center justify-between bg-muted p-2 rounded">
                        <span class="truncate">{file.name}</span>
                        <button 
                            class="text-destructive hover:text-destructive/80"
                            onclick={() => selectedFiles = selectedFiles.filter((_, i) => i !== index)}
                        >
                            ×
                        </button>
                    </div>
                {/each}
            </div>
        {/if}

        <div class="relative">
            <textarea
                bind:value={chatInput}
                placeholder="Send your message"
                onkeydown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                    }
                }}
                oninput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                }}
                rows="1"
                class="w-full bg-muted/50 rounded-lg px-4 py-3 pr-32 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring border border-border resize-none min-h-[44px] max-h-[200px] overflow-y-auto"
                disabled={isLoading}
            ></textarea>
            <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <label class="p-2 hover:bg-muted rounded-full text-muted-foreground cursor-pointer">
                    <input
                        type="file"
                        class="hidden"
                        onchange={(e) => selectedFiles = [...selectedFiles, ...Array.from((e.target as HTMLInputElement).files ?? [])]}
                        multiple
                        disabled={isLoading}
                    />
                    <Paperclip class="w-5 h-5" />
                </label>
                <button 
                    class="p-2 hover:bg-muted rounded-full text-muted-foreground"
                    onmousedown={startRecording}
                    onmouseup={stopRecording}
                    onmouseleave={stopRecording}
                    disabled={isLoading}
                >
                    <Mic class="w-5 h-5" />
                </button>
                <button 
                    class="p-2 hover:bg-muted rounded-full text-muted-foreground"
                    onclick={handleSubmit}
                    disabled={isLoading}
                >
                    <Send class="w-5 h-5" />
                </button>
            </div>
        </div>
    </div>
</div>