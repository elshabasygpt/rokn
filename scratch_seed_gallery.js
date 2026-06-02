import pg from 'pg';
const { Pool } = pg;
import fs from 'fs';

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  database: 'alsuqour',
  user: 'postgres',
  password: ''
});

const portfolioItemsBase = [
  { 
    id: 1, 
    type: 'image', 
    category: 'moving', 
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  { 
    id: 2, 
    type: 'video', 
    category: 'packing', 
    url: 'https://assets.mixkit.co/videos/preview/mixkit-man-packing-boxes-in-a-room-40067-large.mp4', 
    thumbnail: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  { 
    id: 3, 
    type: 'image', 
    category: 'assembly', 
    url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 
    thumbnail: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  { 
    id: 4, 
    type: 'image', 
    category: 'packing', 
    url: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 
    thumbnail: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  { 
    id: 5, 
    type: 'video', 
    category: 'moving', 
    url: 'https://assets.mixkit.co/videos/preview/mixkit-carrying-a-large-box-40066-large.mp4', 
    thumbnail: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  { 
    id: 6, 
    type: 'image', 
    category: 'moving', 
    url: 'https://images.unsplash.com/photo-1519643381401-22c77e60520e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 
    thumbnail: 'https://images.unsplash.com/photo-1519643381401-22c77e60520e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
];

const ar = JSON.parse(fs.readFileSync('src/locales/ar.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));

async function insert() {
  await pool.query('DELETE FROM gallery');
  for (let i = 0; i < portfolioItemsBase.length; i++) {
    const item = portfolioItemsBase[i];
    const query = 'INSERT INTO gallery (type, category, url, thumbnail, title_ar, title_en, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    const values = [
      item.type,
      item.category,
      item.url,
      item.thumbnail,
      ar.gallery.items[item.id] || ('صورة ' + item.id), // Fallback title
      en.gallery?.items?.[item.id] || ('Image ' + item.id), // Fallback title
      i + 1
    ];
    await pool.query(query, values);
  }
  console.log('Successfully inserted default gallery items to PostgreSQL.');
  process.exit(0);
}

insert().catch(err => {
  console.error(err);
  process.exit(1);
});
