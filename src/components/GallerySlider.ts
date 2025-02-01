export function renderGallerySlider(images: any[]): string {
  return `
    <div class="mb-8">
      <div class="relative rounded-lg overflow-hidden">
        <div class="gallery-container h-96">
          ${images.map((image, index) => `
            <div class="gallery-slide absolute inset-0 ${index === 0 ? 'active' : ''}" data-index="${index}">
              <img src="${image.image_url}" alt="${image.caption || ''}" 
                class="w-full h-full object-contain">
            </div>
          `).join('')}
        </div>
        
        ${images.length > 1 ? `
          <button class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75" onclick="prevSlide()">❮</button>
          <button class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75" onclick="nextSlide()">❯</button>
        ` : ''}
      </div>
      
      ${images.length > 0 ? `
        <div class="flex justify-center gap-2 mt-4">
          ${images.map((_, index) => `
            <button class="w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400 gallery-dot ${index === 0 ? 'bg-gray-600' : ''}" 
              data-index="${index}" onclick="goToSlide(${index})"></button>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
}