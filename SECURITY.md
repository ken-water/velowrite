# Security Policy

## Supported Versions

VeloWrite is currently pre-1.0. Security fixes are applied to the latest released version.

## Reporting a Vulnerability

Please do not open a public issue for sensitive vulnerabilities.

Report privately through GitHub security advisories if available, or contact the maintainer through the repository owner account.

Include:

- Affected version or commit.
- Operating system.
- Steps to reproduce.
- Expected impact.
- Whether the issue affects local files, history snapshots, exported HTML, or future sync/AI features.

## Scope Notes

Current VeloWrite is local-first. Core editing does not require a cloud account.

Areas we treat carefully:

- Local file read/write.
- Local history snapshots.
- HTML export escaping.
- Future AI provider keys.
- Future sync credentials.
