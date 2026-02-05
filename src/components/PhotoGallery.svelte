<script lang="ts">
  export let photos: Array<{
    id: number;
    file_url: string;
    caption: string | null;
    caption_override: string | null;
    alt_text: string | null;
    camera: string | null;
    lens: string | null;
    focal_length: string | null;
    aperture: string | null;
    shutter_speed: string | null;
    iso: string | null;
    film_stock: string | null;
    location_name: string | null;
  }>;
  
  let selectedPhoto: typeof photos[0] | null = null;
  let currentIndex = 0;
  let showMetadata = false;
  
  function openLightbox(photo: typeof photos[0], index: number) {
    selectedPhoto = photo;
    currentIndex = index;
  }
  
  function closeLightbox() {
    selectedPhoto = null;
    showMetadata = false;
  }
  
  function nextPhoto() {
    if (currentIndex < photos.length - 1) {
      currentIndex++;
      selectedPhoto = photos[currentIndex];
    }
  }
  
  function prevPhoto() {
    if (currentIndex > 0) {
      currentIndex--;
      selectedPhoto = photos[currentIndex];
    }
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (!selectedPhoto) return;
    
    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowRight') {
      nextPhoto();
    } else if (event.key === 'ArrowLeft') {
      prevPhoto();
    } else if (event.key === 'i' || event.key === 'I') {
      showMetadata = !showMetadata;
    }
  }
  
  function getCaption(photo: typeof photos[0]): string | null {
    return photo.caption_override || photo.caption;
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="photo-gallery">
  {#each photos as photo, index}
    <button 
      class="gallery-item"
      style="animation-delay: {index * 0.05}s"
      on:click={() => openLightbox(photo, index)}
      aria-label="View {photo.alt_text || getCaption(photo) || 'photo'}"
    >
      <div class="photo-wrapper">
        <img 
          src={photo.file_url} 
          alt={photo.alt_text || getCaption(photo) || ''} 
          loading="lazy"
        />
        {#if getCaption(photo)}
          <div class="photo-caption">
            <p>{getCaption(photo)}</p>
          </div>
        {/if}
      </div>
      <div class="photo-border" aria-hidden="true"></div>
    </button>
  {/each}
</div>

{#if selectedPhoto}
  <div class="lightbox" on:click={closeLightbox}>
    <div class="lightbox-content" on:click|stopPropagation>
      
      <!-- Close button -->
      <button class="lightbox-close" on:click={closeLightbox} aria-label="Close">
        ✕
      </button>
      
      <!-- Navigation -->
      {#if currentIndex > 0}
        <button class="lightbox-prev" on:click={prevPhoto} aria-label="Previous">
          ←
        </button>
      {/if}
      
      {#if currentIndex < photos.length - 1}
        <button class="lightbox-next" on:click={nextPhoto} aria-label="Next">
          →
        </button>
      {/if}
      
      <!-- Image -->
      <div class="lightbox-image-wrapper">
        <img 
          src={selectedPhoto.file_url} 
          alt={selectedPhoto.alt_text || getCaption(selectedPhoto) || ''} 
        />
      </div>
      
      <!-- Caption and metadata toggle -->
      <div class="lightbox-info">
        {#if getCaption(selectedPhoto)}
          <p class="lightbox-caption">{getCaption(selectedPhoto)}</p>
        {/if}
        
        {#if selectedPhoto.camera || selectedPhoto.lens || selectedPhoto.film_stock}
          <button 
            class="metadata-toggle" 
            on:click={() => showMetadata = !showMetadata}
          >
            {showMetadata ? 'Hide' : 'Show'} Info
          </button>
        {/if}
      </div>
      
      <!-- Metadata panel -->
      {#if showMetadata}
        <div class="metadata-panel">
          {#if selectedPhoto.camera}
            <div class="metadata-item">
              <span class="metadata-label">Camera</span>
              <span class="metadata-value">{selectedPhoto.camera}</span>
            </div>
          {/if}
          
          {#if selectedPhoto.lens}
            <div class="metadata-item">
              <span class="metadata-label">Lens</span>
              <span class="metadata-value">{selectedPhoto.lens}</span>
            </div>
          {/if}
          
          {#if selectedPhoto.focal_length}
            <div class="metadata-item">
              <span class="metadata-label">Focal Length</span>
              <span class="metadata-value">{selectedPhoto.focal_length}</span>
            </div>
          {/if}
          
          {#if selectedPhoto.aperture}
            <div class="metadata-item">
              <span class="metadata-label">Aperture</span>
              <span class="metadata-value">{selectedPhoto.aperture}</span>
            </div>
          {/if}
          
          {#if selectedPhoto.shutter_speed}
            <div class="metadata-item">
              <span class="metadata-label">Shutter</span>
              <span class="metadata-value">{selectedPhoto.shutter_speed}</span>
            </div>
          {/if}
          
          {#if selectedPhoto.iso}
            <div class="metadata-item">
              <span class="metadata-label">ISO</span>
              <span class="metadata-value">{selectedPhoto.iso}</span>
            </div>
          {/if}
          
          {#if selectedPhoto.film_stock}
            <div class="metadata-item">
              <span class="metadata-label">Film</span>
              <span class="metadata-value">{selectedPhoto.film_stock}</span>
            </div>
          {/if}
          
          {#if selectedPhoto.location_name}
            <div class="metadata-item">
              <span class="metadata-label">Location</span>
              <span class="metadata-value">{selectedPhoto.location_name}</span>
            </div>
          {/if}
        </div>
      {/if}
      
      <!-- Counter -->
      <div class="photo-counter">
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  </div>
{/if}

<style>
  .photo-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--space-md);
    padding: var(--space-md) 0;
  }
  
  .gallery-item {
    position: relative;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    animation: fadeInUp 0.6s var(--ease-editorial) backwards;
    transition: transform 0.3s var(--ease-editorial);
  }
  
  .gallery-item:hover {
    transform: translateY(-8px) rotate(-0.5deg);
  }
  
  .photo-wrapper {
    position: relative;
    background: white;
    border: 2px solid var(--color-sand);
    padding: 10px;
    z-index: 1;
  }
  
  .photo-wrapper img {
    width: 100%;
    height: 350px;
    object-fit: cover;
    display: block;
  }
  
  .photo-caption {
    padding: var(--space-sm);
    background: var(--color-offwhite);
    border-top: 1px solid var(--color-sand);
  }
  
  .photo-caption p {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    line-height: 1.4;
    color: var(--color-stone);
    margin: 0;
  }
  
  .photo-border {
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
  
  .gallery-item:hover .photo-border {
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
    background: rgba(44, 74, 82, 0.98);
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
    max-width: 95vw;
    max-height: 95vh;
    display: flex;
    flex-direction: column;
    animation: scaleIn 0.3s var(--ease-editorial);
  }
  
  @keyframes scaleIn {
    from { 
      opacity: 0;
      transform: scale(0.95);
    }
    to { 
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .lightbox-image-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-md);
    background: white;
    border: 3px solid var(--color-sand);
  }
  
  .lightbox-image-wrapper img {
    max-width: 100%;
    max-height: 75vh;
    display: block;
    object-fit: contain;
  }
  
  .lightbox-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-sm) var(--space-md);
    background: white;
    border-left: 3px solid var(--color-sand);
    border-right: 3px solid var(--color-sand);
  }
  
  .lightbox-caption {
    font-family: var(--font-body);
    font-size: 1rem;
    color: var(--color-deep);
    margin: 0;
  }
  
  .metadata-toggle {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 0.5rem 1rem;
    background: var(--color-sand);
    border: 1px solid var(--color-dune);
    color: var(--color-deep);
    cursor: pointer;
    transition: all 0.2s var(--ease-editorial);
  }
  
  .metadata-toggle:hover {
    background: var(--color-dune);
  }
  
  .metadata-panel {
    padding: var(--space-md);
    background: white;
    border: 3px solid var(--color-sand);
    border-top: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-sm);
  }
  
  .metadata-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .metadata-label {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-stone);
  }
  
  .metadata-value {
    font-family: var(--font-body);
    font-size: 0.875rem;
    color: var(--color-deep);
  }
  
  .photo-counter {
    position: absolute;
    bottom: var(--space-sm);
    right: var(--space-sm);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: white;
    background: rgba(44, 74, 82, 0.9);
    padding: 0.5rem 1rem;
    border: 2px solid var(--color-sand);
  }
  
  /* Navigation buttons */
  .lightbox-close,
  .lightbox-prev,
  .lightbox-next {
    position: absolute;
    width: 50px;
    height: 50px;
    background: var(--color-deep);
    color: white;
    border: 3px solid var(--color-sand);
    font-size: 1.5rem;
    font-family: var(--font-mono);
    cursor: pointer;
    transition: all 0.2s var(--ease-editorial);
    z-index: 10;
  }
  
  .lightbox-close {
    top: -20px;
    right: -20px;
  }
  
  .lightbox-prev {
    left: -60px;
    top: 50%;
    transform: translateY(-50%);
  }
  
  .lightbox-next {
    right: -60px;
    top: 50%;
    transform: translateY(-50%);
  }
  
  .lightbox-close:hover {
    background: var(--color-ocean);
    transform: rotate(90deg);
  }
  
  .lightbox-prev:hover,
  .lightbox-next:hover {
    background: var(--color-ocean);
    transform: translateY(-50%) scale(1.1);
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 1024px) {
    .lightbox-prev {
      left: 10px;
    }
    
    .lightbox-next {
      right: 10px;
    }
  }
  
  @media (max-width: 640px) {
    .photo-gallery {
      grid-template-columns: 1fr;
      gap: var(--space-sm);
    }
    
    .lightbox-content {
      width: 100%;
    }
    
    .lightbox-image-wrapper img {
      max-height: 60vh;
    }
    
    .metadata-panel {
      grid-template-columns: 1fr;
    }
    
    .lightbox-prev,
    .lightbox-next {
      width: 40px;
      height: 40px;
      font-size: 1.25rem;
    }
  }
</style>
