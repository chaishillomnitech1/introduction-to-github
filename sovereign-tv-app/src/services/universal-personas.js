/**
 * Universal Personas Service
 * Vibranium Sovereignty Protocol - Dynamic Mode Switching
 * 
 * Personas:
 * - Tech Purists: Technical terminology, verbose
 * - Trailblazers: Innovative, engaging UI
 * - Beginners: Simplified guidance
 * - Children: Gamified, badges, colorful
 * - Cosmically Aligned: Spiritual tones
 * - Eternal Choices: Omniversal journey
 * 
 * @author Chais Hill - OmniTech1
 */

import express from 'express';

const router = express.Router();

// Persona definitions with comprehensive configurations
const personas = {
  tech_purists: {
    id: 'tech_purists',
    name: 'Tech Purists',
    description: 'Focus on technical terminology and verbose outputs',
    icon: '💻',
    theme: {
      primary: '#1E40AF',
      secondary: '#3B82F6',
      background: '#0F172A',
      text: '#E2E8F0'
    },
    features: {
      verbosity: 'high',
      technical_depth: 'maximum',
      code_snippets: true,
      api_documentation: 'detailed',
      performance_metrics: true
    },
    ui_elements: {
      layout: 'technical-dashboard',
      font: 'monospace',
      animations: 'minimal',
      data_visualization: 'advanced'
    }
  },
  trailblazers: {
    id: 'trailblazers',
    name: 'Trailblazers',
    description: 'Empower forward-thinkers with innovative UI',
    icon: '🚀',
    theme: {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
      background: '#1F2937',
      text: '#F3F4F6'
    },
    features: {
      verbosity: 'balanced',
      innovation_focus: true,
      experimental_features: true,
      future_roadmap: true,
      community_collaboration: true
    },
    ui_elements: {
      layout: 'innovative-grid',
      font: 'modern-sans',
      animations: 'dynamic',
      data_visualization: 'interactive'
    }
  },
  beginners: {
    id: 'beginners',
    name: 'Beginners',
    description: 'Simplified guidance for learning',
    icon: '🌱',
    theme: {
      primary: '#10B981',
      secondary: '#34D399',
      background: '#F9FAFB',
      text: '#111827'
    },
    features: {
      verbosity: 'low',
      tutorials: true,
      step_by_step_guides: true,
      tooltips: 'comprehensive',
      help_center: 'always_visible'
    },
    ui_elements: {
      layout: 'simple-linear',
      font: 'readable-sans',
      animations: 'gentle',
      data_visualization: 'basic'
    }
  },
  children: {
    id: 'children',
    name: 'Children',
    description: 'Gamified engagement with badges',
    icon: '🎮',
    theme: {
      primary: '#F59E0B',
      secondary: '#FBBF24',
      background: '#FFF7ED',
      text: '#78350F'
    },
    features: {
      verbosity: 'minimal',
      gamification: true,
      badges: true,
      rewards: true,
      financial_literacy: true,
      parental_controls: true
    },
    ui_elements: {
      layout: 'colorful-cards',
      font: 'playful-rounded',
      animations: 'fun',
      data_visualization: 'visual-icons'
    },
    badges: [
      { id: 'first_login', name: 'Explorer', icon: '🗺️', description: 'First time logging in' },
      { id: 'frequency_master', name: 'Frequency Master', icon: '🎵', description: 'Listened to all frequencies' },
      { id: 'nft_collector', name: 'NFT Collector', icon: '💎', description: 'Collected first NFT' },
      { id: 'cosmic_achiever', name: 'Cosmic Achiever', icon: '⭐', description: 'Completed cosmic journey' }
    ]
  },
  cosmically_aligned: {
    id: 'cosmically_aligned',
    name: 'Cosmically Aligned Souls',
    description: 'Spiritual tones, tailored per beliefs',
    icon: '🌌',
    theme: {
      primary: '#9333EA',
      secondary: '#C084FC',
      background: '#1E1B4B',
      text: '#E9D5FF'
    },
    features: {
      verbosity: 'moderate',
      spiritual_content: true,
      frequency_alignment: true,
      sacred_geometry: true,
      meditation_guides: true,
      faith_integration: true
    },
    ui_elements: {
      layout: 'sacred-symmetry',
      font: 'elegant-serif',
      animations: 'ethereal',
      data_visualization: 'mandala-patterns'
    },
    frequencies: [432, 528, 639, 741, 852, 963, 777]
  },
  eternal_choices: {
    id: 'eternal_choices',
    name: 'Eternal Choices Mode',
    description: 'Omniversal user journey combining all modes',
    icon: '♾️',
    theme: {
      primary: '#DC2626',
      secondary: '#EF4444',
      background: '#0A0A0A',
      text: '#FFFFFF'
    },
    features: {
      verbosity: 'adaptive',
      mode_switching: 'seamless',
      all_features_enabled: true,
      unified_experience: true,
      cosmic_coherence: true
    },
    ui_elements: {
      layout: 'adaptive-omniversal',
      font: 'adaptive',
      animations: 'multi-dimensional',
      data_visualization: 'comprehensive'
    },
    includes_all_modes: true
  }
};

/**
 * Get all personas
 * GET /api/personas
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    personas: Object.values(personas),
    total: Object.keys(personas).length,
    default: 'beginners'
  });
});

/**
 * Get specific persona
 * GET /api/personas/:id
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const persona = personas[id];
  
  if (!persona) {
    return res.status(404).json({
      error: 'Persona not found',
      message: `Persona '${id}' is not available`,
      available: Object.keys(personas)
    });
  }
  
  res.json({
    success: true,
    persona
  });
});

/**
 * Switch persona mode
 * POST /api/personas/switch
 */
router.post('/switch', (req, res) => {
  const { persona_id, user_id } = req.body;
  
  if (!persona_id) {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'Persona ID is required'
    });
  }
  
  const persona = personas[persona_id];
  
  if (!persona) {
    return res.status(404).json({
      error: 'Persona not found',
      message: `Persona '${persona_id}' is not available`
    });
  }
  
  // In production, this would save to user preferences
  res.json({
    success: true,
    message: 'Persona switched successfully',
    active_persona: persona,
    user_id: user_id || 'guest',
    note: 'In production, this persists to user profile'
  });
});

/**
 * Get persona recommendations
 * GET /api/personas/recommend
 */
router.get('/recommend/:user_level', (req, res) => {
  const { user_level } = req.params;
  
  const recommendations = {
    novice: 'beginners',
    intermediate: 'trailblazers',
    advanced: 'tech_purists',
    spiritual: 'cosmically_aligned',
    young: 'children',
    omniversal: 'eternal_choices'
  };
  
  const recommended = recommendations[user_level] || 'beginners';
  
  res.json({
    success: true,
    user_level,
    recommended_persona: personas[recommended],
    all_personas: Object.values(personas)
  });
});

/**
 * Get children badges
 * GET /api/personas/children/badges
 */
router.get('/children/badges', (req, res) => {
  const childrenPersona = personas.children;
  
  res.json({
    success: true,
    badges: childrenPersona.badges,
    total: childrenPersona.badges.length,
    persona: 'children'
  });
});

/**
 * Award badge to user
 * POST /api/personas/children/award-badge
 */
router.post('/children/award-badge', (req, res) => {
  const { user_id, badge_id } = req.body;
  
  if (!user_id || !badge_id) {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'User ID and badge ID are required'
    });
  }
  
  const badge = personas.children.badges.find(b => b.id === badge_id);
  
  if (!badge) {
    return res.status(404).json({
      error: 'Badge not found',
      message: `Badge '${badge_id}' does not exist`
    });
  }
  
  // In production, this would save to user's badge collection
  res.json({
    success: true,
    message: 'Badge awarded successfully',
    user_id,
    badge,
    note: 'In production, this persists to user achievements'
  });
});

/**
 * Get cosmic frequencies for aligned souls
 * GET /api/personas/cosmic/frequencies
 */
router.get('/cosmic/frequencies', (req, res) => {
  const cosmicPersona = personas.cosmically_aligned;
  
  res.json({
    success: true,
    frequencies: cosmicPersona.frequencies.map(freq => ({
      hz: freq,
      name: `${freq} Hz`,
      purpose: getFrequencyPurpose(freq)
    })),
    persona: 'cosmically_aligned'
  });
});

/**
 * Helper function to get frequency purpose
 */
function getFrequencyPurpose(freq) {
  const purposes = {
    432: 'Natural tuning, heart chakra',
    528: 'DNA repair, love frequency',
    639: 'Connection, relationships',
    741: 'Awakening intuition',
    852: 'Spiritual order',
    963: 'Divine consciousness',
    777: 'Sovereign alignment'
  };
  return purposes[freq] || 'Sacred frequency';
}

export { router as personasRouter };
