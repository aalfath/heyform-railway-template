# Changelog

Breaking changes are listed first in each entry.

## 2026-11-12: HeyForm v3.0.6

First version of this repo-based template. It replaces the older image-based HeyForm template (v3.0.3).

- HeyForm `v3.0.6` (`heyform/community-edition:v3.0.6@sha256:6acd228065ec2adbcae9e751d9876a9b7b9db0bbc44657a25b83a4822822d1e1`). v3.0.3 to v3.0.5 are affected by GHSA-xqwg-g3q8-3cf2 and GHSA-gc7q-cgmp-6p2x.
- Owner account seeded on first boot; public sign-up off by default.
- `INTEGRATION_ENCRYPTION_KEY` generated, so integrations that store credentials are available.
- MongoDB 8.0 runs with `GLIBC_TUNABLES=glibc.pthread.rseq=1`, which stops it crash-looping on hosts with Linux 6.19 or newer.
