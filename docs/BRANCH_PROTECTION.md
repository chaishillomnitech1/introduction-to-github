# Branch Protection Recommendations

This document outlines the recommended branch protection rules for maintaining code quality, security, and stability in the repository.

## 🎯 Overview

Branch protection rules help prevent accidental or malicious changes to important branches, enforce code review processes, and ensure that all changes meet quality standards before being merged.

## 🔒 Recommended Protection Rules

### Main Branch (`main`)

The `main` branch should have the strictest protection rules as it represents the production-ready code.

#### Required Settings

1. **Require pull request reviews before merging**
   - ✅ Required number of approvals: **1**
   - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require review from Code Owners (@chaishillomnitech1)
   - ✅ Restrict who can dismiss pull request reviews (Owners only)

2. **Require status checks to pass before merging**
   - ✅ Require branches to be up to date before merging
   - ✅ Required status checks:
     - `build` (if applicable)
     - `test` (if applicable)
     - `lint` (if applicable)
     - `security-scan` (if applicable)
     - CodeQL analysis

3. **Require conversation resolution before merging**
   - ✅ All conversations must be resolved

4. **Require signed commits**
   - ✅ Enable to ensure commit authenticity
   - Recommended for enhanced security

5. **Include administrators**
   - ✅ Enforce rules for administrators too
   - Ensures consistent process

6. **Restrict who can push to matching branches**
   - ✅ Restrict to: @chaishillomnitech1
   - Prevents accidental direct pushes

7. **Allow force pushes**
   - ❌ Disabled (prevents history rewriting)

8. **Allow deletions**
   - ❌ Disabled (prevents accidental branch deletion)

### Development Branch (`develop`)

If using a development branch for integration before main:

#### Required Settings

1. **Require pull request reviews before merging**
   - ✅ Required approvals: **1**
   - ✅ Require review from Code Owners

2. **Require status checks to pass**
   - ✅ Required checks:
     - `build`
     - `test`
     - `lint`

3. **Allow force pushes**
   - ❌ Disabled

4. **Allow deletions**
   - ❌ Disabled

### Feature Branches (`feature/*`, `fix/*`, etc.)

Feature branches can be more flexible but should still follow good practices:

#### Recommendations

- ✅ No strict protection rules needed
- ✅ Regular syncing with main/develop
- ✅ Delete after merge to keep repository clean
- ✅ Follow naming conventions

## 🛠️ Configuration Steps

### Via GitHub Web Interface

1. Navigate to repository **Settings**
2. Click **Branches** in the left sidebar
3. Click **Add branch protection rule**
4. Configure as outlined above

### Branch Protection Rule Pattern

```
Branch name pattern: main
```

### Example Protection Rule Configuration

```yaml
# For main branch
Branch name pattern: main

✅ Require a pull request before merging
  ✅ Require approvals: 1
  ✅ Dismiss stale pull request approvals when new commits are pushed
  ✅ Require review from Code Owners
  ✅ Require approval of the most recent reviewable push

✅ Require status checks to pass before merging
  ✅ Require branches to be up to date before merging
  Status checks found in the last week for this repository:
    - build
    - test
    - CodeQL

✅ Require conversation resolution before merging

✅ Require signed commits

✅ Include administrators

✅ Restrict who can push to matching branches
  Restrict pushes that create matching branches:
    - @chaishillomnitech1

❌ Allow force pushes (disabled)
❌ Allow deletions (disabled)
```

## 📋 Required Status Checks

Set up these GitHub Actions workflows and mark them as required:

### 1. Build Check
```yaml
# .github/workflows/build.yml
name: Build
on: [pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build
        run: npm run build
```

### 2. Test Check
```yaml
# .github/workflows/test.yml
name: Test
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Test
        run: npm test
```

### 3. Security Check
```yaml
# .github/workflows/security.yml
name: Security
on: [pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Security Scan
        run: npm audit
```

## 🔐 Additional Security Measures

### 1. Enable Vulnerability Alerts

- Navigate to **Settings → Security & analysis**
- Enable **Dependabot alerts**
- Enable **Dependabot security updates**
- Enable **CodeQL analysis**

### 2. Secret Scanning

- Enable **Secret scanning**
- Enable **Push protection**
- Configure custom patterns if needed

### 3. Required Workflows

Consider making certain workflows required:
- Security scanning
- License compliance
- Code quality checks

## 👥 Code Owners Integration

The CODEOWNERS file works with branch protection:

```
# CODEOWNERS
* @chaishillomnitech1

# Specific directories
/contracts/ @chaishillomnitech1
/.github/ @chaishillomnitech1
```

When "Require review from Code Owners" is enabled:
- PRs touching protected files automatically request review from owners
- Cannot merge until code owner approves

## 🚀 Deployment Protection

For deployment branches or tags:

### Production Deployments

```yaml
# Environment protection rules
Environment: production
  ✅ Required reviewers: @chaishillomnitech1
  ✅ Wait timer: 5 minutes
  ✅ Deployment branches: main only
```

### Tag Protection

Protect version tags to prevent unauthorized releases:

```
Tag pattern: v*.*.*
✅ Require signed commits
✅ Restrict creation: @chaishillomnitech1
```

## 📊 Monitoring and Compliance

### Regular Audits

Perform quarterly reviews of:
- Branch protection rules
- Code owner assignments
- Required status checks
- Merge permissions

### Compliance Checklist

- [ ] Main branch fully protected
- [ ] Code owner reviews required
- [ ] Status checks passing required
- [ ] Force pushes disabled
- [ ] Signed commits enabled (recommended)
- [ ] Secret scanning enabled
- [ ] Dependabot alerts enabled
- [ ] Vulnerability scanning active

## 🔄 Workflow Best Practices

### Merging Strategy

**Recommended:** Squash and merge
- Keeps main branch history clean
- All PR changes in single commit
- Easier to revert if needed

**Alternative:** Merge commit
- Preserves full PR history
- Good for complex features

**Avoid:** Rebase and merge
- Can complicate history with protected branches

### Branch Cleanup

- ✅ Enable automatic branch deletion after merge
- ✅ Periodically review and delete stale branches
- ✅ Use branch naming conventions for easy identification

## 🆘 Emergency Procedures

### Hotfix Process

For critical production issues:

1. Create hotfix branch from `main`
   ```bash
   git checkout -b hotfix/critical-issue main
   ```

2. Make minimal fix
3. Create PR with `[HOTFIX]` prefix
4. Request expedited review from @chaishillomnitech1
5. Merge after approval (still require review)
6. Deploy immediately
7. Backport to develop if needed

### Breaking Glass

If emergency access needed (use sparingly):

1. Document reason in issue
2. Temporarily disable specific rule
3. Make necessary change
4. Re-enable protection immediately
5. Create post-mortem
6. Update procedures to prevent future need

## 📝 Documentation Requirements

All PRs should include:

- [ ] Updated README if public API changes
- [ ] Updated CHANGELOG
- [ ] Updated documentation
- [ ] Migration guide for breaking changes

## 🎓 Team Training

Ensure all contributors understand:

1. **Why** branch protection exists
2. **How** to work with protected branches
3. **What** to do if blocked by protection
4. **When** to request emergency access

## 📚 References

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [CODEOWNERS Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [GitHub Actions Status Checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks)

## 🔧 Implementation Checklist

- [ ] Configure main branch protection
- [ ] Set up required status checks
- [ ] Enable code owner reviews
- [ ] Configure signing requirements
- [ ] Enable security features
- [ ] Document emergency procedures
- [ ] Train team on new rules
- [ ] Test with sample PR
- [ ] Monitor and adjust as needed

---

**Implementation Owner:** @chaishillomnitech1  
**Review Cycle:** Quarterly  
**Last Updated:** January 2026

**ALL IS LOVE. ALL IS LAW. ALL IS FLUID. KUN FAYAKŪN!** 🕋♾️✨
