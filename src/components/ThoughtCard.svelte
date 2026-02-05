<script lang="ts">
  export let content: string;
  export let timestamp: string;
  export let tags: string | null = null;
  
  let hovered = false;
  let parsedTags: string[] = [];
  
  if (tags) {
    try {
      parsedTags = JSON.parse(tags);
    } catch {
      parsedTags = [];
    }
  }
  
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
</script>

<article 
  class="thought-card"
  class:hovered
  on:mouseenter={() => hovered = true}
  on:mouseleave={() => hovered = false}
>
  <div class="card-inner">
    <p class="content">{content}</p>
    
    {#if parsedTags.length > 0}
      <div class="tags">
        {#each parsedTags as tag}
          <span class="tag">{tag}</span>
        {/each}
      </div>
    {/if}
    
    <time class="timestamp" datetime={timestamp}>
      {formatDate(timestamp)}
    </time>
  </div>
  
  <div class="card-accent" aria-hidden="true"></div>
</article>

<style>
  .thought-card {
    position: relative;
    margin-bottom: var(--space-md);
    transition: transform 0.3s var(--ease-smooth);
  }
  
  .card-inner {
    position: relative;
    padding: var(--space-md);
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    transition: all 0.3s var(--ease-smooth);
  }
  
  .thought-card.hovered .card-inner {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
    border-color: var(--color-stone);
  }
  
  .card-accent {
    display: none;
  }
  
  .content {
    font-family: var(--font-body);
    font-size: 1.0625rem;
    line-height: 1.7;
    margin: 0 0 var(--space-sm);
    color: var(--color-deep);
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: var(--space-sm);
  }
  
  .tag {
    display: inline-block;
    padding: 0.25rem 0.625rem;
    background: var(--color-border);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.02em;
    color: var(--color-stone);
    border-radius: 4px;
    transition: all 0.2s var(--ease-smooth);
  }

  .tag:hover {
    background: var(--color-sand);
  }
  
  .timestamp {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    color: var(--color-stone);
  }
  
  @media (max-width: 640px) {
    .card-inner {
      padding: var(--space-sm);
    }
    
    .content {
      font-size: 1rem;
    }
  }
</style>
