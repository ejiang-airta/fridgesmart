# FridgeSmart Development Rules

These rules must be followed by all contributors to maintain consistency and project quality.

## 1. Virtual Environment Usage

**ALWAYS use the virtual environment for any operation or testing.**

```bash
# Activate the virtual environment before any operations
source venv/bin/activate

# Only then run commands such as:
npm install
npx expo start
# etc.

# When finished, you can deactivate the environment
deactivate
```

Never run project commands without first activating the virtual environment.

## 2. Project Plan Maintenance

**After completing any development work, update the project plan document.**

The project plan is located at:
```
/Users/e_jiang/Projects/fridgesmart_app/FridgeSmart/PROJECT_PLAN.md
```

Updates should include:
- Marking completed features with ✅
- Adding new components/screens created
- Updating known issues and limitations
- Adding new planned enhancements if applicable

This ensures that all team members have a clear understanding of the project's current state and future direction.

## Additional Best Practices

- Follow the established code style and patterns
- Use TypeScript for type safety
- Document any non-obvious code
- Test your changes on both iOS and Android when applicable 