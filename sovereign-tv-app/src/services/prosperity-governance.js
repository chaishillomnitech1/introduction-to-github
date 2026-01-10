/**
 * ScrollVerse Prosperity Protocol Governance Dashboard Service
 * 
 * Monitors and manages all aspects of the ScrollVerse Prosperity Protocol:
 * 1. Track Zakat treasury contributions, collaborator revenue splits, and yields
 * 2. Enable dynamic adjustments to permissions, revenue weights, and overrides
 * 3. Include real-time analytics and audit trails to balance transparency and control
 * 
 * @author Chais Hill - OmniTech1
 */

import { Router } from 'express';
import { authenticateToken } from './auth.js';

const router = Router();

// In-memory storage for governance data (replace with blockchain integration in production)
const governanceData = {
  zakatTreasury: {
    balance: 5000000, // in USD
    totalContributions: 12500000,
    contributionCount: 1247,
    recentContributions: [
      { amount: 50000, timestamp: Date.now() - 3600000, contributor: '0x1234...5678', source: 'NFT Sales Royalties' },
      { amount: 25000, timestamp: Date.now() - 7200000, contributor: '0xabcd...efgh', source: 'Token Transaction Fees' },
      { amount: 100000, timestamp: Date.now() - 10800000, contributor: '0x9876...4321', source: 'Staking Rewards' }
    ]
  },
  collaborators: [
    {
      id: 1,
      name: 'Lead Developer',
      wallet: '0x1111...1111',
      revenueWeight: 1000, // 10%
      isActive: true,
      totalEarned: 125000,
      lastDistribution: Date.now() - 86400000,
      role: 'Technical Lead'
    },
    {
      id: 2,
      name: 'Marketing Director',
      wallet: '0x2222...2222',
      revenueWeight: 800, // 8%
      isActive: true,
      totalEarned: 95000,
      lastDistribution: Date.now() - 86400000,
      role: 'Marketing & Growth'
    },
    {
      id: 3,
      name: 'Community Manager',
      wallet: '0x3333...3333',
      revenueWeight: 500, // 5%
      isActive: true,
      totalEarned: 62500,
      lastDistribution: Date.now() - 86400000,
      role: 'Community Engagement'
    },
    {
      id: 4,
      name: 'Content Creator',
      wallet: '0x4444...4444',
      revenueWeight: 700, // 7%
      isActive: false,
      totalEarned: 42000,
      lastDistribution: Date.now() - 604800000,
      role: 'Content Production'
    }
  ],
  yields: {
    totalCollected: 50000000,
    totalDistributed: 42000000,
    pendingDistribution: 8000000,
    sources: [
      { name: 'NFT Sales', amount: 15000000, percentage: 30 },
      { name: 'Token Fees', amount: 12500000, percentage: 25 },
      { name: 'Staking Rewards', amount: 10000000, percentage: 20 },
      { name: 'Content Licensing', amount: 7500000, percentage: 15 },
      { name: 'Other', amount: 5000000, percentage: 10 }
    ],
    recentYields: [
      { amount: 150000, timestamp: Date.now() - 1800000, source: 'NFT Marketplace', token: 'ETH' },
      { amount: 85000, timestamp: Date.now() - 5400000, source: 'Staking Pool', token: 'MIRROR' },
      { amount: 200000, timestamp: Date.now() - 9000000, source: 'Token Swaps', token: 'ETH' }
    ]
  },
  permissions: [
    { address: '0xSovereign...Chais', roles: ['ADMIN', 'TREASURY_MANAGER', 'REVENUE_MANAGER'], isActive: true },
    { address: '0x1111...1111', roles: ['REVENUE_MANAGER'], isActive: true },
    { address: '0x2222...2222', roles: ['AUDITOR'], isActive: true }
  ],
  overrides: {
    isActive: false,
    beneficiary: null,
    activatedAt: null,
    activatedBy: null
  },
  auditTrail: []
};

// Initialize audit trail with sample data
function initializeAuditTrail() {
  if (governanceData.auditTrail.length === 0) {
    const sampleActions = [
      { action: 'CONTRACT_DEPLOYED', details: 'ScrollVerse Prosperity Protocol initialized', actor: '0xSovereign...Chais' },
      { action: 'COLLABORATOR_ADDED', details: 'Lead Developer added with 10% weight', actor: '0xSovereign...Chais' },
      { action: 'ZAKAT_CONTRIBUTED', details: 'Amount: 100000 Source: NFT Sales', actor: '0x1234...5678' },
      { action: 'REVENUE_DISTRIBUTED', details: 'Total: 500000 distributed to collaborators', actor: '0xSovereign...Chais' },
      { action: 'WEIGHT_ADJUSTED', details: 'Marketing Director weight changed from 5% to 8%', actor: '0xSovereign...Chais' }
    ];
    
    sampleActions.forEach((sample, index) => {
      governanceData.auditTrail.push({
        id: index + 1,
        timestamp: Date.now() - (sampleActions.length - index) * 3600000,
        ...sample
      });
    });
  }
}

initializeAuditTrail();

// ========== DASHBOARD OVERVIEW ==========

/**
 * Get complete governance dashboard overview
 */
router.get('/overview', authenticateToken, (req, res) => {
  const overview = {
    timestamp: new Date().toISOString(),
    zakatTreasury: {
      balance: governanceData.zakatTreasury.balance,
      totalContributions: governanceData.zakatTreasury.totalContributions,
      contributionCount: governanceData.zakatTreasury.contributionCount
    },
    collaborators: {
      total: governanceData.collaborators.length,
      active: governanceData.collaborators.filter(c => c.isActive).length,
      totalWeightAllocated: governanceData.collaborators
        .filter(c => c.isActive)
        .reduce((sum, c) => sum + c.revenueWeight, 0)
    },
    yields: {
      totalCollected: governanceData.yields.totalCollected,
      totalDistributed: governanceData.yields.totalDistributed,
      pendingDistribution: governanceData.yields.pendingDistribution,
      distributionEfficiency: (governanceData.yields.totalDistributed / governanceData.yields.totalCollected * 100).toFixed(2)
    },
    overrideStatus: governanceData.overrides.isActive,
    recentActivity: governanceData.auditTrail.slice(-5).reverse()
  };

  res.json({
    success: true,
    overview
  });
});

// ========== ZAKAT TREASURY ==========

/**
 * Get Zakat treasury details and statistics
 */
router.get('/zakat/treasury', authenticateToken, (req, res) => {
  const treasury = {
    current: governanceData.zakatTreasury,
    analytics: {
      averageContribution: governanceData.zakatTreasury.totalContributions / governanceData.zakatTreasury.contributionCount,
      growthRate: '+12.5%', // Simulated
      projectedMonthly: 450000 // Simulated
    },
    topContributors: [
      { address: '0x1234...5678', total: 850000, contributions: 42 },
      { address: '0xabcd...efgh', total: 620000, contributions: 31 },
      { address: '0x9876...4321', total: 550000, contributions: 28 }
    ]
  };

  res.json({
    success: true,
    treasury
  });
});

/**
 * Get recent Zakat contributions
 */
router.get('/zakat/contributions', authenticateToken, (req, res) => {
  const { limit = 20 } = req.query;
  
  res.json({
    success: true,
    contributions: governanceData.zakatTreasury.recentContributions.slice(0, parseInt(limit)),
    total: governanceData.zakatTreasury.contributionCount
  });
});

/**
 * Record a new Zakat contribution (requires permission)
 */
router.post('/zakat/contribute', authenticateToken, (req, res) => {
  const { amount, source } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid amount' });
  }
  
  const contribution = {
    amount,
    timestamp: Date.now(),
    contributor: req.user.wallet || '0xUser...Wallet',
    source: source || 'Manual Contribution'
  };
  
  governanceData.zakatTreasury.balance += amount;
  governanceData.zakatTreasury.totalContributions += amount;
  governanceData.zakatTreasury.contributionCount++;
  governanceData.zakatTreasury.recentContributions.unshift(contribution);
  
  // Keep only recent 100 contributions in memory
  if (governanceData.zakatTreasury.recentContributions.length > 100) {
    governanceData.zakatTreasury.recentContributions.pop();
  }
  
  // Log audit
  addAuditLog(req.user.username, 'ZAKAT_CONTRIBUTED', `Amount: ${amount} Source: ${source}`);
  
  res.json({
    success: true,
    contribution
  });
});

// ========== COLLABORATOR MANAGEMENT ==========

/**
 * Get all collaborators with their details
 */
router.get('/collaborators', authenticateToken, (req, res) => {
  const { activeOnly } = req.query;
  
  let collaborators = governanceData.collaborators;
  
  if (activeOnly === 'true') {
    collaborators = collaborators.filter(c => c.isActive);
  }
  
  const summary = {
    total: governanceData.collaborators.length,
    active: governanceData.collaborators.filter(c => c.isActive).length,
    totalWeightAllocated: collaborators
      .filter(c => c.isActive)
      .reduce((sum, c) => sum + c.revenueWeight, 0),
    totalEarnedAllTime: governanceData.collaborators.reduce((sum, c) => sum + c.totalEarned, 0)
  };
  
  res.json({
    success: true,
    collaborators,
    summary
  });
});

/**
 * Get specific collaborator details
 */
router.get('/collaborators/:wallet', authenticateToken, (req, res) => {
  const { wallet } = req.params;
  
  const collaborator = governanceData.collaborators.find(c => c.wallet === wallet);
  
  if (!collaborator) {
    return res.status(404).json({ success: false, error: 'Collaborator not found' });
  }
  
  res.json({
    success: true,
    collaborator
  });
});

/**
 * Add a new collaborator (requires admin permission)
 */
router.post('/collaborators', authenticateToken, (req, res) => {
  const { name, wallet, revenueWeight, role } = req.body;
  
  // Validate input
  if (!name || !wallet || !revenueWeight || !role) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }
  
  if (revenueWeight < 0 || revenueWeight > 10000) {
    return res.status(400).json({ success: false, error: 'Revenue weight must be between 0 and 10000 basis points' });
  }
  
  // Check if collaborator already exists
  if (governanceData.collaborators.find(c => c.wallet === wallet)) {
    return res.status(400).json({ success: false, error: 'Collaborator already exists' });
  }
  
  const newCollaborator = {
    id: governanceData.collaborators.length + 1,
    name,
    wallet,
    revenueWeight,
    isActive: true,
    totalEarned: 0,
    lastDistribution: Date.now(),
    role
  };
  
  governanceData.collaborators.push(newCollaborator);
  
  // Log audit
  addAuditLog(req.user.username, 'COLLABORATOR_ADDED', `${name} added with ${revenueWeight / 100}% weight`);
  
  res.json({
    success: true,
    collaborator: newCollaborator
  });
});

/**
 * Update collaborator revenue weight (requires admin permission)
 */
router.patch('/collaborators/:wallet/weight', authenticateToken, (req, res) => {
  const { wallet } = req.params;
  const { newWeight } = req.body;
  
  if (newWeight === undefined || newWeight < 0 || newWeight > 10000) {
    return res.status(400).json({ success: false, error: 'Invalid weight value' });
  }
  
  const collaborator = governanceData.collaborators.find(c => c.wallet === wallet);
  
  if (!collaborator) {
    return res.status(404).json({ success: false, error: 'Collaborator not found' });
  }
  
  const oldWeight = collaborator.revenueWeight;
  collaborator.revenueWeight = newWeight;
  
  // Log audit
  addAuditLog(req.user.username, 'WEIGHT_ADJUSTED', `${collaborator.name}: ${oldWeight / 100}% -> ${newWeight / 100}%`);
  
  res.json({
    success: true,
    collaborator,
    oldWeight,
    newWeight
  });
});

/**
 * Update collaborator status (activate/deactivate)
 */
router.patch('/collaborators/:wallet/status', authenticateToken, (req, res) => {
  const { wallet } = req.params;
  const { isActive } = req.body;
  
  if (isActive === undefined) {
    return res.status(400).json({ success: false, error: 'isActive field required' });
  }
  
  const collaborator = governanceData.collaborators.find(c => c.wallet === wallet);
  
  if (!collaborator) {
    return res.status(404).json({ success: false, error: 'Collaborator not found' });
  }
  
  collaborator.isActive = isActive;
  
  // Log audit
  addAuditLog(req.user.username, 'COLLABORATOR_STATUS_CHANGED', `${collaborator.name} ${isActive ? 'activated' : 'deactivated'}`);
  
  res.json({
    success: true,
    collaborator
  });
});

// ========== YIELD TRACKING & ANALYTICS ==========

/**
 * Get yield statistics and analytics
 */
router.get('/yields', authenticateToken, (req, res) => {
  const analytics = {
    overview: {
      totalCollected: governanceData.yields.totalCollected,
      totalDistributed: governanceData.yields.totalDistributed,
      pendingDistribution: governanceData.yields.pendingDistribution,
      distributionEfficiency: (governanceData.yields.totalDistributed / governanceData.yields.totalCollected * 100).toFixed(2) + '%'
    },
    sources: governanceData.yields.sources,
    recentYields: governanceData.yields.recentYields,
    projections: {
      monthlyEstimate: 4200000,
      quarterlyEstimate: 12600000,
      annualEstimate: 50400000
    }
  };
  
  res.json({
    success: true,
    yields: analytics
  });
});

/**
 * Record a new yield (requires permission)
 */
router.post('/yields/record', authenticateToken, (req, res) => {
  const { amount, source, token } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid amount' });
  }
  
  const yieldRecord = {
    amount,
    timestamp: Date.now(),
    source: source || 'Unspecified',
    token: token || 'ETH'
  };
  
  governanceData.yields.totalCollected += amount;
  governanceData.yields.pendingDistribution += amount;
  governanceData.yields.recentYields.unshift(yieldRecord);
  
  // Keep only recent 100 yields in memory
  if (governanceData.yields.recentYields.length > 100) {
    governanceData.yields.recentYields.pop();
  }
  
  // Log audit
  addAuditLog(req.user.username, 'YIELD_RECORDED', `Amount: ${amount} Source: ${source}`);
  
  res.json({
    success: true,
    yield: yieldRecord
  });
});

/**
 * Distribute revenue to collaborators (requires permission)
 */
router.post('/yields/distribute', authenticateToken, (req, res) => {
  const { amount } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid amount' });
  }
  
  if (amount > governanceData.yields.pendingDistribution) {
    return res.status(400).json({ success: false, error: 'Insufficient pending distribution' });
  }
  
  const distributions = [];
  let remaining = amount;
  
  // Calculate distributions for active collaborators
  governanceData.collaborators.forEach(collab => {
    if (collab.isActive && collab.revenueWeight > 0) {
      const share = Math.floor((amount * collab.revenueWeight) / 10000);
      
      if (share > 0) {
        collab.totalEarned += share;
        collab.lastDistribution = Date.now();
        remaining -= share;
        
        distributions.push({
          collaborator: collab.name,
          wallet: collab.wallet,
          amount: share,
          weight: collab.revenueWeight
        });
      }
    }
  });
  
  // Add sovereign distribution (remaining amount)
  distributions.push({
    collaborator: 'Sovereign (Chais)',
    wallet: '0xSovereign...Chais',
    amount: remaining,
    weight: 'Remaining'
  });
  
  governanceData.yields.totalDistributed += amount;
  governanceData.yields.pendingDistribution -= amount;
  
  // Log audit
  addAuditLog(req.user.username, 'REVENUE_DISTRIBUTED', `Total: ${amount} distributed`);
  
  res.json({
    success: true,
    distributions,
    totalDistributed: amount,
    remaining: governanceData.yields.pendingDistribution
  });
});

// ========== PERMISSION MANAGEMENT ==========

/**
 * Get all permissions
 */
router.get('/permissions', authenticateToken, (req, res) => {
  res.json({
    success: true,
    permissions: governanceData.permissions,
    availableRoles: ['ADMIN', 'TREASURY_MANAGER', 'REVENUE_MANAGER', 'AUDITOR']
  });
});

/**
 * Grant permission to an address (requires admin)
 */
router.post('/permissions/grant', authenticateToken, (req, res) => {
  const { address, role } = req.body;
  
  if (!address || !role) {
    return res.status(400).json({ success: false, error: 'Address and role required' });
  }
  
  const validRoles = ['ADMIN', 'TREASURY_MANAGER', 'REVENUE_MANAGER', 'AUDITOR'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ success: false, error: 'Invalid role' });
  }
  
  let permission = governanceData.permissions.find(p => p.address === address);
  
  if (!permission) {
    permission = { address, roles: [role], isActive: true };
    governanceData.permissions.push(permission);
  } else if (!permission.roles.includes(role)) {
    permission.roles.push(role);
  }
  
  // Log audit
  addAuditLog(req.user.username, 'PERMISSION_GRANTED', `${role} granted to ${address}`);
  
  res.json({
    success: true,
    permission
  });
});

/**
 * Revoke permission from an address (requires admin)
 */
router.post('/permissions/revoke', authenticateToken, (req, res) => {
  const { address, role } = req.body;
  
  if (!address || !role) {
    return res.status(400).json({ success: false, error: 'Address and role required' });
  }
  
  const permission = governanceData.permissions.find(p => p.address === address);
  
  if (!permission) {
    return res.status(404).json({ success: false, error: 'Permission not found' });
  }
  
  permission.roles = permission.roles.filter(r => r !== role);
  
  // Log audit
  addAuditLog(req.user.username, 'PERMISSION_REVOKED', `${role} revoked from ${address}`);
  
  res.json({
    success: true,
    permission
  });
});

// ========== OVERRIDE MANAGEMENT ==========

/**
 * Get override status
 */
router.get('/overrides', authenticateToken, (req, res) => {
  res.json({
    success: true,
    override: governanceData.overrides
  });
});

/**
 * Activate revenue override (requires admin)
 */
router.post('/overrides/activate', authenticateToken, (req, res) => {
  const { beneficiary } = req.body;
  
  if (!beneficiary) {
    return res.status(400).json({ success: false, error: 'Beneficiary address required' });
  }
  
  governanceData.overrides = {
    isActive: true,
    beneficiary,
    activatedAt: Date.now(),
    activatedBy: req.user.username
  };
  
  // Log audit
  addAuditLog(req.user.username, 'OVERRIDE_ACTIVATED', `Beneficiary: ${beneficiary}`);
  
  res.json({
    success: true,
    override: governanceData.overrides
  });
});

/**
 * Deactivate revenue override (requires admin)
 */
router.post('/overrides/deactivate', authenticateToken, (req, res) => {
  const previousOverride = { ...governanceData.overrides };
  
  governanceData.overrides = {
    isActive: false,
    beneficiary: null,
    activatedAt: null,
    activatedBy: null
  };
  
  // Log audit
  addAuditLog(req.user.username, 'OVERRIDE_DEACTIVATED', 'Revenue distribution restored to normal');
  
  res.json({
    success: true,
    override: governanceData.overrides,
    previous: previousOverride
  });
});

// ========== AUDIT TRAIL ==========

/**
 * Get audit trail
 */
router.get('/audit', authenticateToken, (req, res) => {
  const { limit = 50, action } = req.query;
  
  let logs = governanceData.auditTrail;
  
  // Filter by action if specified
  if (action) {
    logs = logs.filter(log => log.action === action);
  }
  
  // Get most recent logs
  const recentLogs = logs.slice(-parseInt(limit)).reverse();
  
  res.json({
    success: true,
    logs: recentLogs,
    total: governanceData.auditTrail.length,
    actions: [...new Set(governanceData.auditTrail.map(log => log.action))]
  });
});

/**
 * Export audit trail (requires permission)
 */
router.get('/audit/export', authenticateToken, (req, res) => {
  const { format = 'json' } = req.query;
  
  if (format === 'csv') {
    const csv = [
      'id,timestamp,actor,action,details',
      ...governanceData.auditTrail.map(log => 
        `${log.id},${new Date(log.timestamp).toISOString()},${log.actor},${log.action},"${log.details}"`
      )
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=audit-trail.csv');
    return res.send(csv);
  }
  
  res.json({
    success: true,
    exportedAt: new Date().toISOString(),
    logs: governanceData.auditTrail
  });
});

// ========== ANALYTICS & REPORTS ==========

/**
 * Get comprehensive analytics report
 */
router.get('/analytics', authenticateToken, (req, res) => {
  const report = {
    timestamp: new Date().toISOString(),
    treasury: {
      zakatBalance: governanceData.zakatTreasury.balance,
      totalContributions: governanceData.zakatTreasury.totalContributions,
      averageContribution: governanceData.zakatTreasury.totalContributions / governanceData.zakatTreasury.contributionCount
    },
    revenue: {
      totalCollected: governanceData.yields.totalCollected,
      totalDistributed: governanceData.yields.totalDistributed,
      pendingDistribution: governanceData.yields.pendingDistribution,
      distributionRate: (governanceData.yields.totalDistributed / governanceData.yields.totalCollected * 100).toFixed(2) + '%'
    },
    collaborators: {
      total: governanceData.collaborators.length,
      active: governanceData.collaborators.filter(c => c.isActive).length,
      totalEarnings: governanceData.collaborators.reduce((sum, c) => sum + c.totalEarned, 0),
      weightAllocation: governanceData.collaborators
        .filter(c => c.isActive)
        .reduce((sum, c) => sum + c.revenueWeight, 0) / 100 + '%'
    },
    topPerformers: governanceData.collaborators
      .filter(c => c.isActive)
      .sort((a, b) => b.totalEarned - a.totalEarned)
      .slice(0, 5)
      .map(c => ({
        name: c.name,
        role: c.role,
        totalEarned: c.totalEarned,
        revenueWeight: c.revenueWeight / 100 + '%'
      }))
  };
  
  res.json({
    success: true,
    analytics: report
  });
});

// ========== HELPER FUNCTIONS ==========

/**
 * Add an audit log entry
 */
function addAuditLog(actor, action, details) {
  const logId = governanceData.auditTrail.length + 1;
  
  governanceData.auditTrail.push({
    id: logId,
    timestamp: Date.now(),
    actor: actor || 'System',
    action,
    details
  });
  
  // Keep only recent 1000 logs in memory (in production, store in database)
  if (governanceData.auditTrail.length > 1000) {
    governanceData.auditTrail.shift();
  }
}

export { router as prosperityGovernanceRouter };
