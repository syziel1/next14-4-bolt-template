# Branch Protection Rulesets

This directory contains GitHub branch protection rulesets that can be imported into your repository.

## main-branch-protection.json

This ruleset protects the main/default branch with the following rules:

- **Deletion protection**: Prevents the branch from being deleted
- **Non-fast-forward protection**: Prevents force pushes and requires linear history
- **Pull request requirements**:
  - All changes must go through a pull request
  - Squash merge only
  - Required review thread resolution
  - Automatic Copilot code reviews enabled
- **Copilot code review**: Automatically reviews code on push and for draft PRs
- **Required linear history**: Enforces a clean, linear commit history
- **Required status checks**:
  - `lint-code`: Ensures code passes linting checks before merging
  - Strict mode: Requires branch to be up-to-date before merging

### Customizing Status Checks

The `required_status_checks` section specifies which CI/CD checks must pass before merging. The configuration uses only the `context` name, making it portable across different repositories and GitHub App installations.

If you need to restrict status checks to a specific GitHub App installation, you can add an `integration_id` field (where `integration_id` refers to the GitHub App's installation ID as shown in GitHub's API and UI):

```json
"required_status_checks": [
  {
    "context": "lint-code",
    "integration_id": 12345 // This is the GitHub App's installation ID
  }
]

### Importing the Ruleset

To import this ruleset into your repository:

1. Go to your repository Settings → Rules → Rulesets
2. Click "New ruleset" → "Import a ruleset"
3. Upload the JSON file or paste its contents
4. Review and adjust the configuration as needed
5. Click "Create" to activate the ruleset

Alternatively, you can use the GitHub API or CLI to import the ruleset programmatically.
