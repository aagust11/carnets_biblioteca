import { CardImageData } from '../types';

const DB_NAME = 'qr_cards_db';
const STORE_NAME = 'cards_store';
const DB_VERSION = 1;
const KEY_CARD_IMAGES = 'saved_card_images';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB no suportat'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveCardImagesToStorage(images: CardImageData): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(images, KEY_CARD_IMAGES);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    // Fallback to localStorage if IndexedDB fails
    try {
      localStorage.setItem('qr_saved_card_images_fallback', JSON.stringify(images));
    } catch {
      console.warn('No s\'han pogut desar les imatges per límit d\'emmagatzematge', e);
    }
  }
}

export async function loadCardImagesFromStorage(): Promise<CardImageData | null> {
  try {
    const db = await openDb();
    return await new Promise<CardImageData | null>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(KEY_CARD_IMAGES);
      req.onsuccess = () => {
        resolve(req.result || null);
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    try {
      const fallback = localStorage.getItem('qr_saved_card_images_fallback');
      if (fallback) return JSON.parse(fallback);
    } catch {
      return null;
    }
    return null;
  }
}
