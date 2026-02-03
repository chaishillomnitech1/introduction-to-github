/**
 * Interactive UI Innovations Service
 * Vibranium Sovereignty Protocol - Advanced UI Components
 * 
 * Features:
 * - Tuneable frequency sliders
 * - Personalized service UI buttons
 * - Real-time interactive learning/game zones
 * 
 * @author Chais Hill - OmniTech1
 */

import express from 'express';

const router = express.Router();

// Frequency configurations
const frequencies = [
  { hz: 174, name: 'Foundation', color: '#8B4513', purpose: 'Pain relief, security' },
  { hz: 285, name: 'Quantum Cognition', color: '#4B0082', purpose: 'Energy field repair' },
  { hz: 396, name: 'Liberation', color: '#FF0000', purpose: 'Liberating guilt and fear' },
  { hz: 417, name: 'Transformation', color: '#FF8C00', purpose: 'Undoing situations' },
  { hz: 432, name: 'Natural Tuning', color: '#00CED1', purpose: 'Heart chakra resonance' },
  { hz: 528, name: 'Love Frequency', color: '#00FF00', purpose: 'DNA repair, miracles' },
  { hz: 639, name: 'Connection', color: '#FFFF00', purpose: 'Relationships, connection' },
  { hz: 741, name: 'Awakening', color: '#0000FF', purpose: 'Awakening intuition' },
  { hz: 777, name: 'Sovereign', color: '#FFD700', purpose: 'Sovereign alignment' },
  { hz: 852, name: 'Spiritual Order', color: '#9400D3', purpose: 'Spiritual enlightenment' },
  { hz: 963, name: 'Divine Consciousness', color: '#FF1493', purpose: 'Pineal gland activation' }
];

// Personalized service buttons
const serviceButtons = {
  spotify_integration: {
    id: 'spotify_integration',
    name: 'Spotify Integration',
    icon: '🎵',
    color: '#1DB954',
    action: '/api/spotify',
    description: 'Access Spotify music with 528 Hz alignment'
  },
  nft_marketplace: {
    id: 'nft_marketplace',
    name: 'NFT Marketplace',
    icon: '💎',
    color: '#8B5CF6',
    action: '/api/nft-crossrealms',
    description: 'Explore NFTs across OpenSea, Rarible, Magic Eden'
  },
  language_selector: {
    id: 'language_selector',
    name: 'Language Selection',
    icon: '🌍',
    color: '#3B82F6',
    action: '/api/i18n',
    description: 'Select your preferred language'
  },
  faith_icons: {
    id: 'faith_icons',
    name: 'Faith & Inclusivity',
    icon: '☩',
    color: '#EC4899',
    action: '/api/faith',
    description: 'Explore universal faith symbols'
  },
  persona_mode: {
    id: 'persona_mode',
    name: 'Persona Mode',
    icon: '👤',
    color: '#F59E0B',
    action: '/api/personas',
    description: 'Switch between user personas'
  },
  frequency_tuner: {
    id: 'frequency_tuner',
    name: 'Frequency Tuner',
    icon: '🎛️',
    color: '#10B981',
    action: '/api/ui-innovations/frequency',
    description: 'Tune your vibrational frequency'
  },
  learning_zone: {
    id: 'learning_zone',
    name: 'Learning Zone',
    icon: '📚',
    color: '#6366F1',
    action: '/api/ui-innovations/learning',
    description: 'Interactive learning modules'
  },
  game_zone: {
    id: 'game_zone',
    name: 'Game Zone',
    icon: '🎮',
    color: '#EF4444',
    action: '/api/ui-innovations/games',
    description: 'Gamified cosmic experiences'
  }
};

// Learning modules
const learningModules = [
  {
    id: 'intro_scrollverse',
    title: 'Introduction to ScrollVerse',
    level: 'beginner',
    duration: '15 minutes',
    topics: ['ScrollVerse basics', 'Cosmic coherence', 'Vibrational alignment'],
    badge: 'explorer'
  },
  {
    id: 'nft_mastery',
    title: 'NFT Mastery',
    level: 'intermediate',
    duration: '30 minutes',
    topics: ['NFT platforms', 'Minting', 'Cross-realm transfers'],
    badge: 'nft_collector'
  },
  {
    id: 'frequency_healing',
    title: 'Frequency Healing',
    level: 'advanced',
    duration: '45 minutes',
    topics: ['528 Hz alignment', 'Chakra tuning', 'Cosmic resonance'],
    badge: 'frequency_master'
  }
];

// Game zones
const gameZones = [
  {
    id: 'frequency_quest',
    title: 'Frequency Quest',
    type: 'adventure',
    description: 'Journey through different frequencies to unlock cosmic wisdom',
    rewards: ['badges', 'scrollcoins', 'nft_drops']
  },
  {
    id: 'nft_treasure_hunt',
    title: 'NFT Treasure Hunt',
    type: 'collection',
    description: 'Discover hidden NFTs across the omniverse',
    rewards: ['nfts', 'badges', 'special_access']
  },
  {
    id: 'cosmic_puzzle',
    title: 'Cosmic Puzzle',
    type: 'puzzle',
    description: 'Solve sacred geometry puzzles to enhance coherence',
    rewards: ['badges', 'wisdom_points', 'frequency_boosts']
  }
];

/**
 * Get all available frequencies
 * GET /api/ui-innovations/frequencies
 */
router.get('/frequencies', (req, res) => {
  res.json({
    success: true,
    frequencies,
    total: frequencies.length,
    default: 528
  });
});

/**
 * Set frequency preference
 * POST /api/ui-innovations/frequency/set
 */
router.post('/frequency/set', (req, res) => {
  const { hz, user_id } = req.body;
  
  const frequency = frequencies.find(f => f.hz === parseInt(hz));
  
  if (!frequency) {
    return res.status(400).json({
      error: 'Invalid frequency',
      available: frequencies.map(f => f.hz)
    });
  }
  
  res.json({
    success: true,
    message: 'Frequency set successfully',
    frequency,
    user_id: user_id || 'guest',
    note: 'In production, this persists to user profile'
  });
});

/**
 * Get all service buttons
 * GET /api/ui-innovations/service-buttons
 */
router.get('/service-buttons', (req, res) => {
  res.json({
    success: true,
    buttons: Object.values(serviceButtons),
    total: Object.keys(serviceButtons).length
  });
});

/**
 * Get specific service button
 * GET /api/ui-innovations/service-button/:id
 */
router.get('/service-button/:id', (req, res) => {
  const { id } = req.params;
  const button = serviceButtons[id];
  
  if (!button) {
    return res.status(404).json({
      error: 'Service button not found',
      available: Object.keys(serviceButtons)
    });
  }
  
  res.json({
    success: true,
    button
  });
});

/**
 * Get learning modules
 * GET /api/ui-innovations/learning
 */
router.get('/learning', (req, res) => {
  const { level } = req.query;
  
  let modules = [...learningModules];
  
  if (level) {
    modules = modules.filter(m => m.level === level);
  }
  
  res.json({
    success: true,
    modules,
    total: modules.length,
    levels: ['beginner', 'intermediate', 'advanced']
  });
});

/**
 * Start learning module
 * POST /api/ui-innovations/learning/start
 */
router.post('/learning/start', (req, res) => {
  const { module_id, user_id } = req.body;
  
  const module = learningModules.find(m => m.id === module_id);
  
  if (!module) {
    return res.status(404).json({
      error: 'Learning module not found',
      available: learningModules.map(m => m.id)
    });
  }
  
  res.json({
    success: true,
    message: 'Learning module started',
    module,
    user_id: user_id || 'guest',
    progress: 0,
    started_at: new Date().toISOString()
  });
});

/**
 * Get game zones
 * GET /api/ui-innovations/games
 */
router.get('/games', (req, res) => {
  const { type } = req.query;
  
  let games = [...gameZones];
  
  if (type) {
    games = games.filter(g => g.type === type);
  }
  
  res.json({
    success: true,
    games,
    total: games.length,
    types: ['adventure', 'collection', 'puzzle']
  });
});

/**
 * Start game
 * POST /api/ui-innovations/games/start
 */
router.post('/games/start', (req, res) => {
  const { game_id, user_id } = req.body;
  
  const game = gameZones.find(g => g.id === game_id);
  
  if (!game) {
    return res.status(404).json({
      error: 'Game not found',
      available: gameZones.map(g => g.id)
    });
  }
  
  res.json({
    success: true,
    message: 'Game started',
    game,
    user_id: user_id || 'guest',
    session_id: Math.random().toString(36).substr(2, 9),
    started_at: new Date().toISOString()
  });
});

/**
 * Get UI configuration
 * GET /api/ui-innovations/config
 */
router.get('/config', (req, res) => {
  res.json({
    success: true,
    config: {
      frequency_slider: {
        enabled: true,
        min: 174,
        max: 963,
        default: 528,
        step: 1
      },
      service_buttons: {
        enabled: true,
        layout: 'grid',
        total: Object.keys(serviceButtons).length
      },
      learning_zone: {
        enabled: true,
        total_modules: learningModules.length
      },
      game_zone: {
        enabled: true,
        total_games: gameZones.length
      },
      cosmic_coherence: true
    }
  });
});

export { router as uiInnovationsRouter };
