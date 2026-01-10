/**
 * ScrollVerse Prosperity Protocol Governance Dashboard
 * 
 * React component for monitoring and managing:
 * 1. Zakat treasury contributions and balances
 * 2. Collaborator revenue splits and earnings
 * 3. Yield tracking and distribution analytics
 * 4. Permission management and access control
 * 5. Real-time audit trails and activity logs
 * 
 * @author Chais Hill - OmniTech1
 */

import React, { useState, useEffect } from 'react';

const ProsperityGovernanceDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [zakatTreasury, setZakatTreasury] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [yields, setYields] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/prosperity-governance/overview', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch overview');
      
      const data = await response.json();
      setOverview(data.overview);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchZakatTreasury = async () => {
    try {
      const response = await fetch('/api/prosperity-governance/zakat/treasury', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch treasury');
      
      const data = await response.json();
      setZakatTreasury(data.treasury);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCollaborators = async () => {
    try {
      const response = await fetch('/api/prosperity-governance/collaborators', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch collaborators');
      
      const data = await response.json();
      setCollaborators(data.collaborators);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchYields = async () => {
    try {
      const response = await fetch('/api/prosperity-governance/yields', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch yields');
      
      const data = await response.json();
      setYields(data.yields);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch('/api/prosperity-governance/audit?limit=50', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      
      const data = await response.json();
      setAuditLogs(data.logs);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await fetch('/api/prosperity-governance/permissions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch permissions');
      
      const data = await response.json();
      setPermissions(data.permissions);
    } catch (err) {
      setError(err.message);
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Render loading state
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <h2>Loading Governance Dashboard...</h2>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && !overview) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchOverview} style={styles.button}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>ScrollVerse Prosperity Protocol</h1>
        <p style={styles.subtitle}>Governance Dashboard - Monitor & Manage</p>
      </div>

      {/* Tab Navigation */}
      <div style={styles.tabs}>
        <button
          style={activeTab === 'overview' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          style={activeTab === 'zakat' ? styles.activeTab : styles.tab}
          onClick={() => {
            setActiveTab('zakat');
            if (!zakatTreasury) fetchZakatTreasury();
          }}
        >
          Zakat Treasury
        </button>
        <button
          style={activeTab === 'collaborators' ? styles.activeTab : styles.tab}
          onClick={() => {
            setActiveTab('collaborators');
            if (collaborators.length === 0) fetchCollaborators();
          }}
        >
          Collaborators
        </button>
        <button
          style={activeTab === 'yields' ? styles.activeTab : styles.tab}
          onClick={() => {
            setActiveTab('yields');
            if (!yields) fetchYields();
          }}
        >
          Yields
        </button>
        <button
          style={activeTab === 'permissions' ? styles.activeTab : styles.tab}
          onClick={() => {
            setActiveTab('permissions');
            if (permissions.length === 0) fetchPermissions();
          }}
        >
          Permissions
        </button>
        <button
          style={activeTab === 'audit' ? styles.activeTab : styles.tab}
          onClick={() => {
            setActiveTab('audit');
            if (auditLogs.length === 0) fetchAuditLogs();
          }}
        >
          Audit Trail
        </button>
      </div>

      {/* Tab Content */}
      <div style={styles.content}>
        {/* Overview Tab */}
        {activeTab === 'overview' && overview && (
          <div>
            <h2 style={styles.sectionTitle}>Dashboard Overview</h2>
            
            <div style={styles.grid}>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Zakat Treasury</h3>
                <p style={styles.cardValue}>{formatCurrency(overview.zakatTreasury.balance)}</p>
                <p style={styles.cardLabel}>Current Balance</p>
                <p style={styles.cardDetail}>
                  Total Contributions: {formatCurrency(overview.zakatTreasury.totalContributions)}
                </p>
                <p style={styles.cardDetail}>
                  Contribution Count: {overview.zakatTreasury.contributionCount.toLocaleString()}
                </p>
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Collaborators</h3>
                <p style={styles.cardValue}>{overview.collaborators.active}/{overview.collaborators.total}</p>
                <p style={styles.cardLabel}>Active Collaborators</p>
                <p style={styles.cardDetail}>
                  Weight Allocated: {overview.collaborators.totalWeightAllocated / 100}%
                </p>
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Yields</h3>
                <p style={styles.cardValue}>{formatCurrency(overview.yields.totalCollected)}</p>
                <p style={styles.cardLabel}>Total Collected</p>
                <p style={styles.cardDetail}>
                  Distributed: {formatCurrency(overview.yields.totalDistributed)}
                </p>
                <p style={styles.cardDetail}>
                  Pending: {formatCurrency(overview.yields.pendingDistribution)}
                </p>
                <p style={styles.cardDetail}>
                  Efficiency: {overview.yields.distributionEfficiency}%
                </p>
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Override Status</h3>
                <p style={styles.cardValue}>
                  {overview.overrideStatus ? '🔴 Active' : '🟢 Inactive'}
                </p>
                <p style={styles.cardLabel}>Revenue Override</p>
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Recent Activity</h3>
              <div style={styles.logList}>
                {overview.recentActivity.map((log, index) => (
                  <div key={index} style={styles.logItem}>
                    <span style={styles.logTime}>{formatDate(log.timestamp)}</span>
                    <span style={styles.logAction}>{log.action}</span>
                    <span style={styles.logDetails}>{log.details}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Zakat Treasury Tab */}
        {activeTab === 'zakat' && zakatTreasury && (
          <div>
            <h2 style={styles.sectionTitle}>Zakat Treasury</h2>
            
            <div style={styles.grid}>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Current Balance</h3>
                <p style={styles.cardValue}>{formatCurrency(zakatTreasury.current.balance)}</p>
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Total Contributions</h3>
                <p style={styles.cardValue}>{formatCurrency(zakatTreasury.current.totalContributions)}</p>
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Average Contribution</h3>
                <p style={styles.cardValue}>{formatCurrency(zakatTreasury.analytics.averageContribution)}</p>
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Growth Rate</h3>
                <p style={styles.cardValue}>{zakatTreasury.analytics.growthRate}</p>
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Top Contributors</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Address</th>
                    <th style={styles.th}>Total</th>
                    <th style={styles.th}>Contributions</th>
                  </tr>
                </thead>
                <tbody>
                  {zakatTreasury.topContributors.map((contributor, index) => (
                    <tr key={index}>
                      <td style={styles.td}>{contributor.address}</td>
                      <td style={styles.td}>{formatCurrency(contributor.total)}</td>
                      <td style={styles.td}>{contributor.contributions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Recent Contributions</h3>
              <div style={styles.logList}>
                {zakatTreasury.current.recentContributions.map((contribution, index) => (
                  <div key={index} style={styles.logItem}>
                    <span style={styles.logTime}>{formatDate(contribution.timestamp)}</span>
                    <span style={styles.logAmount}>{formatCurrency(contribution.amount)}</span>
                    <span style={styles.logDetails}>{contribution.source}</span>
                    <span style={styles.logActor}>{contribution.contributor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Collaborators Tab */}
        {activeTab === 'collaborators' && collaborators.length > 0 && (
          <div>
            <h2 style={styles.sectionTitle}>Collaborator Management</h2>
            
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Weight</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Total Earned</th>
                  <th style={styles.th}>Last Distribution</th>
                </tr>
              </thead>
              <tbody>
                {collaborators.map((collab, index) => (
                  <tr key={index} style={collab.isActive ? {} : styles.inactiveRow}>
                    <td style={styles.td}>{collab.name}</td>
                    <td style={styles.td}>{collab.role}</td>
                    <td style={styles.td}>{collab.revenueWeight / 100}%</td>
                    <td style={styles.td}>
                      {collab.isActive ? '🟢 Active' : '🔴 Inactive'}
                    </td>
                    <td style={styles.td}>{formatCurrency(collab.totalEarned)}</td>
                    <td style={styles.td}>{formatDate(collab.lastDistribution)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Yields Tab */}
        {activeTab === 'yields' && yields && (
          <div>
            <h2 style={styles.sectionTitle}>Yield Tracking & Analytics</h2>
            
            <div style={styles.grid}>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Total Collected</h3>
                <p style={styles.cardValue}>{formatCurrency(yields.overview.totalCollected)}</p>
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Total Distributed</h3>
                <p style={styles.cardValue}>{formatCurrency(yields.overview.totalDistributed)}</p>
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Pending Distribution</h3>
                <p style={styles.cardValue}>{formatCurrency(yields.overview.pendingDistribution)}</p>
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Efficiency</h3>
                <p style={styles.cardValue}>{yields.overview.distributionEfficiency}</p>
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Yield Sources</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Source</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {yields.sources.map((source, index) => (
                    <tr key={index}>
                      <td style={styles.td}>{source.name}</td>
                      <td style={styles.td}>{formatCurrency(source.amount)}</td>
                      <td style={styles.td}>{source.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Recent Yields</h3>
              <div style={styles.logList}>
                {yields.recentYields.map((yieldRecord, index) => (
                  <div key={index} style={styles.logItem}>
                    <span style={styles.logTime}>{formatDate(yieldRecord.timestamp)}</span>
                    <span style={styles.logAmount}>{formatCurrency(yieldRecord.amount)}</span>
                    <span style={styles.logDetails}>{yieldRecord.source}</span>
                    <span style={styles.logToken}>{yieldRecord.token}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Permissions Tab */}
        {activeTab === 'permissions' && permissions.length > 0 && (
          <div>
            <h2 style={styles.sectionTitle}>Permission Management</h2>
            
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Address</th>
                  <th style={styles.th}>Roles</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((perm, index) => (
                  <tr key={index}>
                    <td style={styles.td}>{perm.address}</td>
                    <td style={styles.td}>{perm.roles.join(', ')}</td>
                    <td style={styles.td}>
                      {perm.isActive ? '🟢 Active' : '🔴 Inactive'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Audit Trail Tab */}
        {activeTab === 'audit' && auditLogs.length > 0 && (
          <div>
            <h2 style={styles.sectionTitle}>Audit Trail</h2>
            
            <div style={styles.logList}>
              {auditLogs.map((log, index) => (
                <div key={index} style={styles.auditLogItem}>
                  <div style={styles.auditHeader}>
                    <span style={styles.logTime}>{formatDate(log.timestamp)}</span>
                    <span style={styles.logAction}>{log.action}</span>
                  </div>
                  <div style={styles.auditDetails}>
                    <span style={styles.logActor}>Actor: {log.actor}</span>
                    <span style={styles.logDetails}>{log.details}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#0a0a0a',
    color: '#ffffff',
    minHeight: '100vh'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '10px'
  },
  title: {
    fontSize: '2.5rem',
    margin: '0 0 10px 0',
    color: '#ffffff'
  },
  subtitle: {
    fontSize: '1.2rem',
    margin: '0',
    opacity: '0.9'
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  },
  tab: {
    flex: '1',
    minWidth: '120px',
    padding: '12px 20px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: '2px solid #333',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease'
  },
  activeTab: {
    flex: '1',
    minWidth: '120px',
    padding: '12px 20px',
    backgroundColor: '#667eea',
    color: '#ffffff',
    border: '2px solid #667eea',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold'
  },
  content: {
    backgroundColor: '#1a1a1a',
    padding: '30px',
    borderRadius: '10px',
    border: '1px solid #333'
  },
  sectionTitle: {
    fontSize: '1.8rem',
    marginBottom: '20px',
    color: '#667eea'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  card: {
    backgroundColor: '#0a0a0a',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #333'
  },
  cardTitle: {
    fontSize: '1rem',
    color: '#888',
    marginBottom: '10px'
  },
  cardValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: '5px'
  },
  cardLabel: {
    fontSize: '0.9rem',
    color: '#888',
    marginBottom: '10px'
  },
  cardDetail: {
    fontSize: '0.85rem',
    color: '#aaa',
    margin: '3px 0'
  },
  section: {
    marginTop: '30px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px'
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    backgroundColor: '#0a0a0a',
    borderBottom: '2px solid #667eea',
    color: '#667eea',
    fontWeight: 'bold'
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #333',
    color: '#ffffff'
  },
  inactiveRow: {
    opacity: '0.5'
  },
  logList: {
    marginTop: '15px'
  },
  logItem: {
    display: 'flex',
    gap: '15px',
    padding: '12px',
    marginBottom: '10px',
    backgroundColor: '#0a0a0a',
    borderRadius: '5px',
    border: '1px solid #333',
    flexWrap: 'wrap'
  },
  auditLogItem: {
    padding: '15px',
    marginBottom: '10px',
    backgroundColor: '#0a0a0a',
    borderRadius: '5px',
    border: '1px solid #333'
  },
  auditHeader: {
    display: 'flex',
    gap: '15px',
    marginBottom: '8px',
    flexWrap: 'wrap'
  },
  auditDetails: {
    display: 'flex',
    gap: '15px',
    fontSize: '0.9rem',
    color: '#aaa',
    flexWrap: 'wrap'
  },
  logTime: {
    color: '#888',
    fontSize: '0.85rem',
    minWidth: '180px'
  },
  logAction: {
    color: '#667eea',
    fontWeight: 'bold',
    minWidth: '150px'
  },
  logDetails: {
    color: '#aaa',
    flex: '1',
    minWidth: '200px'
  },
  logAmount: {
    color: '#4ade80',
    fontWeight: 'bold',
    minWidth: '120px'
  },
  logToken: {
    color: '#888',
    minWidth: '80px'
  },
  logActor: {
    color: '#888',
    minWidth: '200px'
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    color: '#667eea'
  },
  error: {
    textAlign: 'center',
    padding: '50px',
    color: '#ef4444'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#667eea',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '20px'
  }
};

export default ProsperityGovernanceDashboard;
