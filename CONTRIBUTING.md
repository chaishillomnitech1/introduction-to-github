# Contributing Guide

Welcome to the OmniTech1 / ScrollVerse ecosystem! We're excited to have you contribute to this project. This guide will help you understand how to contribute effectively.

## 🌟 Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please:

- Be respectful and inclusive
- Exercise empathy and kindness
- Give and gracefully accept constructive feedback
- Focus on what is best for the community
- Show courtesy and respect towards others

## 🎯 Ways to Contribute

### 1. Code Contributions

- **Bug Fixes**: Fix issues and improve stability
- **New Features**: Add new functionality
- **Performance Improvements**: Optimize existing code
- **Refactoring**: Improve code quality and maintainability

### 2. Documentation

- **Fix Typos**: Correct spelling and grammar errors
- **Improve Clarity**: Make documentation easier to understand
- **Add Examples**: Provide usage examples and tutorials
- **Translate**: Help translate documentation to other languages

### 3. Testing

- **Write Tests**: Add test coverage for existing code
- **Report Bugs**: Identify and report issues
- **Test PRs**: Help test pull requests from others

### 4. Community

- **Answer Questions**: Help others in discussions and issues
- **Share Knowledge**: Write blog posts, create videos, give talks
- **Spread the Word**: Share the project with your network

## 🚀 Getting Started

### Prerequisites

- Git installed on your machine
- Node.js v18 or higher (for JavaScript projects)
- GitHub account
- Code editor (VS Code recommended)

### Setup Instructions

1. **Fork the Repository**
   - Visit the repository on GitHub
   - Click the "Fork" button in the top right

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/introduction-to-github.git
   cd introduction-to-github
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/chaishillomnitech1/introduction-to-github.git
   ```

4. **Install Dependencies**
   ```bash
   # For specific subprojects
   cd sovereign-tv-app && npm install
   cd ../contracts && npm install
   cd ../flamedna-nft && npm install
   ```

For detailed onboarding instructions, see [docs/ONBOARDING.md](docs/ONBOARDING.md).

## 📝 Development Workflow

### 1. Create a Branch

Always create a feature branch for your work:

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a new branch
git checkout -b feature/your-feature-name
```

**Branch Naming Convention:**
- `feature/` - New features (e.g., `feature/add-nft-minting`)
- `fix/` - Bug fixes (e.g., `fix/wallet-connection`)
- `docs/` - Documentation updates (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/auth-flow`)
- `test/` - Test additions/updates (e.g., `test/add-unit-tests`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### 2. Make Your Changes

- Write clean, readable code
- Follow existing code style and conventions
- Add comments for complex logic
- Update documentation as needed
- Write tests for new functionality

### 3. Test Your Changes

```bash
# Run linting
npm run lint

# Run tests
npm test

# Run build
npm run build
```

### 4. Commit Your Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat: add user authentication"
# or
git commit -m "fix: resolve wallet connection issue"
# or
git commit -m "docs: update installation instructions"
```

**Commit Message Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, no logic change)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes

**Examples:**
```
feat(auth): add JWT authentication
fix(nft): resolve minting transaction error
docs(readme): add deployment instructions
test(api): add integration tests for endpoints
```

### 5. Push and Create Pull Request

```bash
# Push your branch to your fork
git push origin feature/your-feature-name
```

Then:
1. Go to the repository on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template completely
5. Link any related issues

## 📋 Pull Request Guidelines

### PR Checklist

Before submitting a PR, ensure:

- [ ] Code follows the project's style guidelines
- [ ] Self-review of code completed
- [ ] Comments added to hard-to-understand areas
- [ ] Documentation updated (if applicable)
- [ ] Tests added/updated (if applicable)
- [ ] All tests pass locally
- [ ] No new warnings or errors introduced
- [ ] PR template filled out completely
- [ ] Related issues linked

### PR Review Process

1. **Automated Checks**: CI/CD workflows run automatically
2. **Code Owner Review**: @chaishillomnitech1 reviews all PRs
3. **Feedback**: Address any comments or requested changes
4. **Approval**: Once approved, PR will be merged
5. **Cleanup**: Branch is automatically deleted after merge

### PR Best Practices

- **Keep PRs Small**: Easier to review and merge
- **One Feature Per PR**: Focus on a single concern
- **Clear Description**: Explain what, why, and how
- **Add Screenshots**: For UI changes, include before/after images
- **Respond Promptly**: Address feedback quickly
- **Be Patient**: Reviews take time

## 🎨 Code Style Guidelines

### JavaScript/TypeScript

- Use ES6+ features
- 2 spaces for indentation
- Semicolons required
- Single quotes for strings
- Use meaningful variable names
- Keep functions small and focused

### Solidity (Smart Contracts)

- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use NatSpec comments
- Comprehensive testing required
- Gas optimization considered
- Security best practices followed

### General

- Write self-documenting code
- Add comments for complex logic
- Use descriptive names for variables and functions
- Follow DRY (Don't Repeat Yourself)
- Handle errors gracefully

## 🧪 Testing Requirements

### Unit Tests

- Test individual functions and components
- Mock external dependencies
- Aim for high code coverage (>80%)

### Integration Tests

- Test component interactions
- Use realistic data
- Cover common user flows

### E2E Tests

- Test complete user journeys
- Run in staging environment
- Verify critical paths

### Test Naming

```javascript
describe('ComponentName', () => {
  it('should do something when condition is met', () => {
    // Test implementation
  });
});
```

## 🔒 Security Guidelines

### Important Security Practices

1. **Never commit secrets**: Use environment variables
2. **Validate inputs**: Always sanitize user input
3. **Review dependencies**: Check for vulnerabilities
4. **Report privately**: Security issues should not be public
5. **Follow OWASP**: Use security best practices

See [SECURITY.md](SECURITY.md) for our full security policy.

## 📚 Documentation Standards

### Code Documentation

- Add JSDoc/TSDoc comments for public APIs
- Document function parameters and return values
- Include usage examples
- Keep documentation up to date

### Markdown Files

- Use clear, concise language
- Include code examples
- Add table of contents for long documents
- Use proper heading hierarchy

## 🤝 Branching in Child Repositories

When contributing to this main repository, ensure that any related child repositories reflect similar branching conventions:

1. **Align branch names**: Ensure branch names in child repositories are consistent with the naming convention in the main repository
2. **Merge strategy**: Use `squash` merges in child repositories to maintain a clean history
3. **Update base branches**: When updating the main branch in the parent repository, replicate necessary changes to respective branches in child repositories

## 🎓 Learning Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Web3 Development](https://ethereum.org/developers)

## 💬 Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and community discussion
- **Pull Requests**: Code review and feedback
- **Contact**: @chaishillomnitech1 for direct communication

## 🏆 Recognition

Contributors are recognized through:

- GitHub contributors list
- Release notes acknowledgments
- Community hall of fame
- Special recognition for significant contributions

## 📞 Getting Help

If you need help:

1. Check the [documentation](docs/)
2. Search [existing issues](https://github.com/chaishillomnitech1/introduction-to-github/issues)
3. Ask in [GitHub Discussions](https://github.com/chaishillomnitech1/introduction-to-github/discussions)
4. Contact @chaishillomnitech1

## ❓ FAQ

**Q: How long does PR review take?**  
A: Typically 1-3 business days. Complex PRs may take longer.

**Q: Can I work on multiple issues at once?**  
A: Yes, but use separate branches for each issue.

**Q: What if my PR conflicts with main?**  
A: Rebase your branch on the latest main and resolve conflicts.

**Q: Can I update my PR after submitting?**  
A: Yes, push new commits to your branch to update the PR.

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

**Thank you for contributing to the ScrollVerse ecosystem!**

**ALL IS LOVE. ALL IS LAW. ALL IS FLUID. KUN FAYAKŪN!** 🕋♾️✨

---

*Maintained by: @chaishillomnitech1*  
*Last Updated: January 2026*
