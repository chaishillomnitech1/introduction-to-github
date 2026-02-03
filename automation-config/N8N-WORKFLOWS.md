# n8n Workflow Configuration
# Part of Infinite Ultrathink State Initiative

## Overview
n8n is used for custom workflow automation and advanced integrations not available in Make.com.

## Workflow Categories

### 1. Advanced Integrations (15 workflows)
- Custom API endpoints
- Webhook processing
- Database operations (advanced queries)
- File management and processing

### 2. AI Agent Coordination (10 workflows)
- Multi-AI orchestration (Claude + ChatGPT + custom)
- Response aggregation and synthesis
- Decision routing based on context
- Context management across conversations

### 3. Real-Time Processing (15 workflows)
- Stream processing for live data
- Event handling and routing
- Notification systems
- Alert management

### 4. Development & Testing (10 workflows)
- Sandbox environments
- A/B testing automation
- Quality assurance workflows
- Performance monitoring

## Deployment Architecture

### Self-Hosted Configuration
```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: scrollverse-n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=${N8N_USER}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD}
      - N8N_HOST=${N8N_HOST}
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - NODE_ENV=production
      - WEBHOOK_URL=https://n8n.scrollverse.com/
      - GENERIC_TIMEZONE=America/New_York
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
    volumes:
      - ./n8n-data:/home/node/.n8n
      - ./workflows:/home/node/.n8n/workflows
    networks:
      - scrollverse-network

  postgres:
    image: postgres:14
    container_name: scrollverse-n8n-db
    restart: always
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=n8n
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - scrollverse-network

volumes:
  postgres-data:

networks:
  scrollverse-network:
    driver: bridge
```

## Key Workflows

### 1. AI Agent Orchestration
```json
{
  "name": "AI Agent Orchestration",
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300],
      "parameters": {
        "path": "ai-orchestration",
        "responseMode": "responseNode"
      }
    },
    {
      "name": "Claude Analysis",
      "type": "n8n-nodes-base.httpRequest",
      "position": [450, 200],
      "parameters": {
        "url": "https://api.anthropic.com/v1/messages",
        "method": "POST",
        "authentication": "headerAuth"
      }
    },
    {
      "name": "ChatGPT Generation",
      "type": "n8n-nodes-base.openAi",
      "position": [450, 400],
      "parameters": {
        "operation": "message",
        "model": "gpt-4-turbo-preview"
      }
    },
    {
      "name": "Aggregate Results",
      "type": "n8n-nodes-base.merge",
      "position": [650, 300],
      "parameters": {
        "mode": "combine"
      }
    },
    {
      "name": "Respond",
      "type": "n8n-nodes-base.respondToWebhook",
      "position": [850, 300],
      "parameters": {
        "respondWith": "json"
      }
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [{"node": "Claude Analysis"}, {"node": "ChatGPT Generation"}]
      ]
    },
    "Claude Analysis": {
      "main": [
        [{"node": "Aggregate Results", "type": "main", "index": 0}]
      ]
    },
    "ChatGPT Generation": {
      "main": [
        [{"node": "Aggregate Results", "type": "main", "index": 1}]
      ]
    },
    "Aggregate Results": {
      "main": [
        [{"node": "Respond"}]
      ]
    }
  }
}
```

### 2. Revenue Distribution Automation
```json
{
  "name": "Revenue Distribution",
  "nodes": [
    {
      "name": "Payment Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300],
      "parameters": {
        "path": "payment-received"
      }
    },
    {
      "name": "Calculate Splits",
      "type": "n8n-nodes-base.function",
      "position": [450, 300],
      "parameters": {
        "functionCode": "const amount = items[0].json.amount;\nreturn [\n  {\n    json: {\n      zakat: amount * 0.025,\n      reinvestment: amount * 0.30,\n      treasury: amount * 0.30,\n      personal: amount * 0.375\n    }\n  }\n];"
      }
    },
    {
      "name": "Trigger Smart Contract",
      "type": "n8n-nodes-base.httpRequest",
      "position": [650, 300],
      "parameters": {
        "url": "https://api.scrollverse.com/distribute-revenue",
        "method": "POST"
      }
    },
    {
      "name": "Update Database",
      "type": "n8n-nodes-base.postgres",
      "position": [850, 300],
      "parameters": {
        "operation": "insert",
        "table": "transactions"
      }
    },
    {
      "name": "Send Notification",
      "type": "n8n-nodes-base.emailSend",
      "position": [1050, 300],
      "parameters": {
        "to": "sovereign@scrollverse.com",
        "subject": "Revenue Distribution Complete"
      }
    }
  ]
}
```

### 3. Content Publishing Pipeline
```json
{
  "name": "Multi-Platform Content Publisher",
  "nodes": [
    {
      "name": "Content Trigger",
      "type": "n8n-nodes-base.webhook"
    },
    {
      "name": "Get Content",
      "type": "n8n-nodes-base.postgres"
    },
    {
      "name": "Format Content",
      "type": "n8n-nodes-base.function"
    },
    {
      "name": "Publish to Spotify",
      "type": "n8n-nodes-base.httpRequest"
    },
    {
      "name": "Publish to YouTube",
      "type": "n8n-nodes-base.httpRequest"
    },
    {
      "name": "Publish to Instagram",
      "type": "n8n-nodes-base.httpRequest"
    },
    {
      "name": "Publish to Twitter",
      "type": "n8n-nodes-base.httpRequest"
    },
    {
      "name": "Verify All Published",
      "type": "n8n-nodes-base.merge"
    },
    {
      "name": "Update Analytics",
      "type": "n8n-nodes-base.postgres"
    }
  ]
}
```

## Workflow Templates

### Template: AI Content Generation
**Trigger**: Scheduled (daily) or webhook  
**Steps**:
1. Fetch content ideas from database
2. Send to Claude for strategy
3. Send to ChatGPT for generation
4. Send to Midjourney for images
5. Combine all outputs
6. Save to content library
7. Schedule for publishing

### Template: Error Monitoring
**Trigger**: Error webhook from any service  
**Steps**:
1. Receive error notification
2. Log to database
3. Check severity level
4. If critical: Send SMS + Email + Slack
5. If moderate: Send Email + Slack
6. If low: Log only
7. Create ticket in project management

### Template: Customer Onboarding
**Trigger**: New customer signup  
**Steps**:
1. Validate customer data
2. Create accounts in all systems
3. Send welcome email sequence
4. Add to CRM
5. Schedule follow-up tasks
6. Trigger onboarding workflow
7. Assign to customer success team

## Environment Variables
```bash
# n8n Configuration
N8N_HOST=n8n.scrollverse.com
N8N_PORT=5678
N8N_PROTOCOL=https
N8N_USER=admin
N8N_PASSWORD=<secure-password>
N8N_ENCRYPTION_KEY=<encryption-key>

# Database
POSTGRES_USER=n8n_user
POSTGRES_PASSWORD=<db-password>
POSTGRES_DB=n8n
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# External APIs
ANTHROPIC_API_KEY=<claude-key>
OPENAI_API_KEY=<openai-key>
SPOTIFY_API_KEY=<spotify-key>
SHOPIFY_API_KEY=<shopify-key>

# Webhooks
WEBHOOK_BASE_URL=https://n8n.scrollverse.com
```

## Monitoring & Maintenance

### Health Checks
```bash
# Check n8n status
curl https://n8n.scrollverse.com/healthz

# Check workflow executions
curl https://n8n.scrollverse.com/api/v1/executions

# Database backup
pg_dump -U n8n_user n8n > backup_$(date +%Y%m%d).sql
```

### Performance Metrics
- Workflow execution time: <30s average
- Success rate: >99%
- Error recovery: <5 minutes
- Uptime: 99.9%

## Workflow Execution Targets

| Category | Workflows | Daily Executions | Monthly Operations |
|----------|-----------|------------------|-------------------|
| Advanced Integrations | 15 | 200+ | 6,000+ |
| AI Coordination | 10 | 500+ | 15,000+ |
| Real-Time Processing | 15 | 1000+ | 30,000+ |
| Development & Testing | 10 | 100+ | 3,000+ |
| **TOTAL** | **50** | **1,800+** | **54,000+** |

## Backup & Recovery
- Daily automated backups
- 30-day retention policy
- Disaster recovery plan documented
- Failover to secondary instance available

---

**Status**: Active Deployment  
**Access**: https://n8n.scrollverse.com  
**Owner**: Supreme Sovereign Chais Kenyatta Hill  
**Last Updated**: 2026-02-03  
**Version**: 1.0.0
