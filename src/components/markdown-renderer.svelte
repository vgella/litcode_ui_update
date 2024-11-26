<script lang="ts">
    import { Carta } from 'carta-md';
    import 'carta-md/default.css';
    import DOMPurify from 'isomorphic-dompurify';
    
    export let content: string;
    
    const carta = new Carta({
        sanitizer: (html) => DOMPurify.sanitize(html)
    });
</script>

<div class="prose prose-invert max-w-none">
    {carta.render(content)}
</div>

<style>
    :global(.prose pre) {
        background-color: #1e1e1e;
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 1rem 0;
    }
    
    :global(.prose code) {
        color: #e6e6e6;
        background-color: #2d2d2d;
        padding: 0.2rem 0.4rem;
        border-radius: 0.25rem;
    }
</style>