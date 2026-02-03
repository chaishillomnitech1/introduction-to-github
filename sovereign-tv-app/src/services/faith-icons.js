/**
 * Faith and Inclusivity Icons Service
 * Vibranium Sovereignty Protocol - Universal Faith Representation
 * 
 * Features:
 * - Cross ☩, Crescent ☪, Om 🕉, Star of David ✡, Lotus 🌷
 * - Expandable placeholder system
 * - Universal inclusivity
 * 
 * @author Chais Hill - OmniTech1
 */

import express from 'express';

const router = express.Router();

// Faith icons with expandable structure
const faithIcons = {
  christianity: {
    id: 'christianity',
    name: 'Christianity',
    symbol: '☩',
    unicode: 'U+2629',
    description: 'Christian Cross',
    color: '#8B0000',
    traditions: ['Catholic', 'Protestant', 'Orthodox', 'Anglican']
  },
  islam: {
    id: 'islam',
    name: 'Islam',
    symbol: '☪',
    unicode: 'U+262A',
    description: 'Star and Crescent',
    color: '#006400',
    traditions: ['Sunni', 'Shia', 'Sufi']
  },
  hinduism: {
    id: 'hinduism',
    name: 'Hinduism',
    symbol: '🕉',
    unicode: 'U+1F549',
    description: 'Om Symbol',
    color: '#FF6B00',
    traditions: ['Vaishnavism', 'Shaivism', 'Shaktism']
  },
  judaism: {
    id: 'judaism',
    name: 'Judaism',
    symbol: '✡',
    unicode: 'U+2721',
    description: 'Star of David',
    color: '#0038B8',
    traditions: ['Orthodox', 'Conservative', 'Reform']
  },
  buddhism: {
    id: 'buddhism',
    name: 'Buddhism',
    symbol: '☸',
    unicode: 'U+2638',
    description: 'Wheel of Dharma',
    color: '#FFD700',
    traditions: ['Theravada', 'Mahayana', 'Vajrayana']
  },
  lotus: {
    id: 'lotus',
    name: 'Universal Enlightenment',
    symbol: '🌷',
    unicode: 'U+1F337',
    description: 'Lotus Flower',
    color: '#FF69B4',
    traditions: ['Universal', 'Cross-Faith']
  },
  peace: {
    id: 'peace',
    name: 'Peace',
    symbol: '☮',
    unicode: 'U+262E',
    description: 'Peace Symbol',
    color: '#4169E1',
    traditions: ['Universal']
  },
  yin_yang: {
    id: 'yin_yang',
    name: 'Taoism',
    symbol: '☯',
    unicode: 'U+262F',
    description: 'Yin Yang',
    color: '#000000',
    traditions: ['Taoism', 'Balance']
  },
  khanda: {
    id: 'khanda',
    name: 'Sikhism',
    symbol: '☬',
    unicode: 'U+262C',
    description: 'Khanda',
    color: '#FF8C00',
    traditions: ['Sikhism']
  },
  // Expandable placeholders
  placeholder_1: {
    id: 'placeholder_1',
    name: 'Custom Faith 1',
    symbol: '⭐',
    unicode: 'U+2B50',
    description: 'Expandable placeholder for additional faiths',
    color: '#9370DB',
    traditions: ['Expandable'],
    expandable: true
  },
  placeholder_2: {
    id: 'placeholder_2',
    name: 'Custom Faith 2',
    symbol: '✨',
    unicode: 'U+2728',
    description: 'Expandable placeholder for additional faiths',
    color: '#20B2AA',
    traditions: ['Expandable'],
    expandable: true
  },
  placeholder_3: {
    id: 'placeholder_3',
    name: 'Custom Faith 3',
    symbol: '🔯',
    unicode: 'U+1F52F',
    description: 'Expandable placeholder for additional faiths',
    color: '#DA70D6',
    traditions: ['Expandable'],
    expandable: true
  }
};

/**
 * Get all faith icons
 * GET /api/faith/icons
 */
router.get('/icons', (req, res) => {
  res.json({
    success: true,
    icons: Object.values(faithIcons),
    total: Object.keys(faithIcons).length,
    expandable: Object.values(faithIcons).filter(i => i.expandable).length
  });
});

/**
 * Get specific faith icon
 * GET /api/faith/icon/:id
 */
router.get('/icon/:id', (req, res) => {
  const { id } = req.params;
  const icon = faithIcons[id];
  
  if (!icon) {
    return res.status(404).json({
      error: 'Faith icon not found',
      message: `Faith icon '${id}' is not available`,
      available: Object.keys(faithIcons)
    });
  }
  
  res.json({
    success: true,
    icon
  });
});

/**
 * Get faith icons by tradition
 * GET /api/faith/search
 */
router.get('/search', (req, res) => {
  const { tradition, color } = req.query;
  
  let results = Object.values(faithIcons);
  
  if (tradition) {
    results = results.filter(icon => 
      icon.traditions.some(t => 
        t.toLowerCase().includes(tradition.toLowerCase())
      )
    );
  }
  
  if (color) {
    results = results.filter(icon => 
      icon.color.toLowerCase() === color.toLowerCase()
    );
  }
  
  res.json({
    success: true,
    icons: results,
    total: results.length,
    filters: { tradition, color }
  });
});

/**
 * Add custom faith icon (expandable system)
 * POST /api/faith/add-icon
 */
router.post('/add-icon', (req, res) => {
  const { id, name, symbol, unicode, description, color, traditions } = req.body;
  
  if (!id || !name || !symbol) {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'ID, name, and symbol are required'
    });
  }
  
  // In production, this would persist to a database
  const newIcon = {
    id,
    name,
    symbol,
    unicode: unicode || 'Custom',
    description: description || `Custom faith icon: ${name}`,
    color: color || '#888888',
    traditions: traditions || ['Custom'],
    expandable: true,
    custom: true
  };
  
  res.json({
    success: true,
    message: 'Faith icon added successfully',
    icon: newIcon,
    note: 'In production, this persists to the faith database'
  });
});

/**
 * Get faith diversity statistics
 * GET /api/faith/stats
 */
router.get('/stats', (req, res) => {
  const totalIcons = Object.keys(faithIcons).length;
  const expandable = Object.values(faithIcons).filter(i => i.expandable).length;
  const faithCategories = [...new Set(Object.values(faithIcons).map(i => i.name))].length;
  
  res.json({
    success: true,
    statistics: {
      total_icons: totalIcons,
      expandable_slots: expandable,
      faith_categories: faithCategories,
      inclusivity_level: 'Universal',
      cosmic_coherence: true
    }
  });
});

/**
 * Get all symbols as array
 * GET /api/faith/symbols
 */
router.get('/symbols', (req, res) => {
  const symbols = Object.values(faithIcons).map(icon => ({
    id: icon.id,
    name: icon.name,
    symbol: icon.symbol
  }));
  
  res.json({
    success: true,
    symbols,
    total: symbols.length
  });
});

export { router as faithIconsRouter };
