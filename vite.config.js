import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function autoSyncPhotosPlugin() {
  const isImg = (f) => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(f);

  const formatPhotoName = (filename) => {
    const base = filename.replace(/\.[^/.]+$/, '');
    if (base.startsWith('PXL_')) {
      const match = base.match(/^PXL_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})/);
      if (match) {
        return `PXL ${match[1]}-${match[2]}-${match[3]} (${match[4]}:${match[5]})`;
      }
    }
    return base
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();
  };

  const sync = () => {
    try {
      const rootPhotos = path.resolve(import.meta.dirname, 'Photos');
      const pubPhotos = path.resolve(import.meta.dirname, 'public/Photos');
      if (!fs.existsSync(pubPhotos)) fs.mkdirSync(pubPhotos, { recursive: true });

      if (fs.existsSync(rootPhotos)) {
        const rootFiles = fs.readdirSync(rootPhotos).filter(isImg);
        for (const file of rootFiles) {
          const src = path.join(rootPhotos, file);
          const dst = path.join(pubPhotos, file);
          if (!fs.existsSync(dst)) {
            fs.copyFileSync(src, dst);
          }
        }
      }

      const pubFiles = fs.readdirSync(pubPhotos).filter(isImg).sort();
      const list = pubFiles.map((file) => ({
        name: formatPhotoName(file),
        filename: file,
        url: `/Photos/${file}`,
        category: 'Photos'
      }));

      const outPath = path.resolve(import.meta.dirname, 'src/data/photos.generated.js');
      const content = `// Auto-generated photo registry for /Photos\nexport const photosAtLocation = ${JSON.stringify(list, null, 2)};\n`;
      fs.writeFileSync(outPath, content);
    } catch (e) {
      console.warn('Could not auto-sync photos:', e.message);
    }
  };

  return {
    name: 'auto-sync-photos',
    buildStart() {
      sync();
    },
    configureServer(server) {
      sync();
      const rootPhotos = path.resolve(import.meta.dirname, 'Photos');
      const pubPhotos = path.resolve(import.meta.dirname, 'public/Photos');
      const watcher = (filePath) => {
        if (filePath && filePath.includes('Photos') && isImg(filePath)) {
          sync();
        }
      };
      server.watcher.add([rootPhotos, pubPhotos]);
      server.watcher.on('add', watcher);
      server.watcher.on('change', watcher);
      server.watcher.on('unlink', watcher);
    }
  };
}

// Pure client-side static app — no backend or auth required
export default defineConfig({
  plugins: [react(), autoSyncPhotosPlugin()],
  base: '/Pin-Parvati/',
  server: {
    port: 3001,
    open: false,
  }
});
