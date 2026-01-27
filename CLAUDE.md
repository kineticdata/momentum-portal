# Momentum Portal - Project Context

## Overview
Kinetic platform portal with export/import tooling for forms, workflows, integrator connections, and task routines.

## Tech Stack
- Ruby scripts for export/import tooling (uses KineticSDK)
- Kinetic platform (forms, workflows, kapps)
- Task routines in XML format

## Directory Structure
```
template/
├── export/
│   ├── core/space/kapps/    # Forms and workflows (24 forms)
│   ├── integrator/          # Connection configs (connections.json)
│   └── task/routines/       # XML workflow routines (12 routines)
├── tooling/
│   ├── export.rb            # Main export script
│   ├── export_driver.rb     # Driver with credential handling
│   ├── integrator.rb        # Integrator export helper
│   └── README.md            # Tooling documentation
└── export.zip               # Bundled export package
```

## Current Work (as of 2026-01-26)

### Branch: `feature/workflow_export`

**Recent commits:**
- `160afad` - Fix parameter name mismatch in routines (Limit [integer] → Limit [0-1000])
- `0602772` - Export of workflow and forms (38 files, major update)
- `6fc858b` - Initial export

**Pending changes to commit:**
- Modified: `template/export.zip`, `template/export/integrator/connections.json`
- Deleted test artifacts: `test.json`, `aatest1.json`, `test/securityPolicyDefinitions.json`
- New: `template/export/core/space/teams/string.json`

**Next steps:**
1. Commit pending changes (cleanup test artifacts)
2. Validate exported workflows
3. Test import process

## Key Files
- `template/tooling/export.rb:1` - Main export logic
- `template/tooling/integrator.rb:1` - Integrator connection exports
- `template/export/integrator/connections.json` - HTTP connections and operations

## Conventions
- Credentials are sanitized (removed) before export
- Only "submission-submitted" workflow triggers are currently exported
- Routine parameters must match connection definitions exactly

## Session Notes
<!-- Add notes from conversations here -->

### 2026-01-26
- Explored codebase structure for workflow export feature
- Created this CLAUDE.md for session continuity
