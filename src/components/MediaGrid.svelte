<script lang="ts">
  export let media: Array<{
    id: number;
    file_url: string;
    caption: string | null;
    alt_text: string | null;
    type: string;
    created_at: string;
  }>;
  
  let selectedMedia: typeof media[0] | null = null;
  
  function openLightbox(item: typeof media[0]) {
    selectedMedia = item;
  }
  
  function closeLightbox() {
    selectedMedia = null;
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && selectedMedia) {
      closeLightbox();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="media-grid">
  {#each media as item, index}
    <button 
      class="media-item"
      style="animation-delay: {index * 0.1}s"
      on:click={() => openLightbox(item)}
      aria-label="View {item.alt_text || item.caption || 'image'}"
    >
      <div class="media-wrapper">
        <img 
          src={item.file_url} 
          alt={item.alt_text || item.caption || ''} 
          loading="lazy"
        />
        {#if item.caption}
          <div class="media-caption">
            <p>{item.caption}</p>
          </div>
        {/if}
      </div>
      <div class="media-border" aria-hidden="true"></div>
    </button>
  {/each}
</div>

{#if selectedMedia}
  <div class="lightbox" on:click={closeLightbox}>
    <div class="lightbox-content" on:click|stopPropagation>
      <button class="lightbox-close" on:click={closeLightbox} aria-label="Close">
        ✕
      </button>
      <img 
        src={selectedMedia.file_url} 
        alt={selectedMedia.alt_text || selectedMedia.caption || ''} 
      />
      {#if selectedMedia.caption}
        <p class="lightbox-caption">{selectedMedia.caption}</p>
      {/if}
    </div>
  </div>
{/if}

<style>
  .media-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-md);
    padding: var(--space-md) 0;
  }
  
  .media-item {
    position: relative;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    animation: fadeInUp 0.6s var(--ease-editorial) backwards;
    transition: transform 0.3s var(--ease-editorial);
  }
  
  .media-item:hover {
    transform: translateY(-8px) rotate(-1deg);
  }
  
  .media-wrapper {
    position: relative;
    background: white;
    border: 2px solid var(--color-sand);
    padding: 12px;
    z-index: 1;
  }
  
  .media-wrapper img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    display: block;
  }
  
  .media-caption {
    padding: var(--space-sm);
    background: var(--color-offwhite);
    border-top: 1px solid var(--color-sand);
  }
  
  .media-caption p {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    line-height: 1.4;
    color: var(--color-stone);
    margin: 0;
  }
  
  .media-border {
    position: absolute;
    top: 8px;
    left: 8px;
    right: -8px;
    bottom: -8px;
    background: var(--color-sand);
    border: 2px solid var(--color-dune);
    z-index: 0;
    transition: all 0.3s var(--ease-editorial);
  }
  
  .media-item:hover .media-border {
    top: 12px;
    left: 12px;
  }
  
  /* Lightbox */
  .lightbox {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(44, 74, 82, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: var(--space-md);
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .lightbox-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    background: white;
    padding: var(--space-md);
    border: 3px solid var(--color-sand);
    animation: scaleIn 0.3s var(--ease-editorial);
  }
  
  @keyframes scaleIn {
    from { 
      opacity: 0;
      transform: scale(0.9);
    }
    to { 
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .lightbox-content img {
    max-width: 100%;
    max-height: calc(90vh - 120px);
    display: block;
    margin: 0 auto;
  }
  
  .lightbox-caption {
    margin-top: var(--space-sm);
    font-family: var(--font-body);
    font-size: 1rem;
    text-align: center;
    color: var(--color-stone);
  }
  
  .lightbox-close {
    position: absolute;
    top: -16px;
    right: -16px;
    width: 48px;
    height: 48px;
    background: var(--color-deep);
    color: white;
    border: 3px solid var(--color-sand);
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.2s var(--ease-editorial);
    font-family: var(--font-mono);
  }
  
  .lightbox-close:hover {
    background: var(--color-ocean);
    transform: rotate(90deg);
  }
  
  @media (max-width: 640px) {
    .media-grid {
      grid-template-columns: 1fr;
      gap: var(--space-sm);
    }
    
    .lightbox-content {
      padding: var(--space-sm);
    }
  }
</style>
