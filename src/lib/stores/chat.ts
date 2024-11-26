import { writable } from 'svelte/store';

export type ChatMessage = {
    sender: 'User' | 'AI';
    text: string;
    isCode: boolean;
    timestamp: Date;
};

export type ChatTab = {
    id: string;
    title: string;
    messages: ChatMessage[];
};

type ChatStore = {
    tabs: ChatTab[];
    activeTabId: string;
    selectedModel: string;
};

// Add helper for generating chat names
function generateChatName(tabCount: number): string {
    return `Chat-${String(tabCount + 1).padStart(3, '0')}`;
}

function createChatStore() {
    const { subscribe, set, update } = writable<ChatStore>({
        tabs: [],
        activeTabId: '',
        selectedModel: 'litchat superbasic'
    });

    return {
        subscribe,
        addMessage: (message: ChatMessage) => update(store => {
            const activeTab = store.tabs.find(tab => tab.id === store.activeTabId);
            if (activeTab) {
                activeTab.messages = [...activeTab.messages, message];
            }
            return store;
        }),
        createNewTab: () => update(store => {
            const newId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const newTitle = generateChatName(store.tabs.length);
            store.tabs.push({
                id: newId,
                title: newTitle,
                messages: []
            });
            store.activeTabId = newId;
            return store;
        }),
        setActiveTab: (id: string) => update(store => ({ ...store, activeTabId: id })),
        updateTabTitle: (id: string, title: string) => update(store => {
            const tab = store.tabs.find(t => t.id === id);
            if (tab) tab.title = title;
            return store;
        }),
        setModel: (model: string) => update(store => ({ ...store, selectedModel: model })),
        deleteTab: (id: string) => update(store => {
            const filteredTabs = store.tabs.filter(t => t.id !== id);
            if (store.activeTabId === id) {
                store.activeTabId = filteredTabs[0]?.id || '';
            }
            store.tabs = filteredTabs;
            return store;
        })
    };
}

export const chatStore = createChatStore();