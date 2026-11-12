[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/NoMr_k?utm_medium=integration&utm_source=button&utm_campaign=heyform)

# HeyForm on Railway

Railway template for [HeyForm](https://github.com/heyform/heyform) Community Edition, the open-source form builder for conversational forms, surveys, quizzes and polls.

## What it deploys

| Service | Source | Notes |
| --- | --- | --- |
| `heyform` | this repo: `Dockerfile` built on `heyform/community-edition:v3.0.6` (pinned by digest) | Public domain on port 9157, health check `/health`, volume at `/app/packages/server/static/upload` for uploaded files |
| `MongoDB` | `mongo:8.0` | Private only, volume at `/data/db`. Stores forms, submissions and accounts |
| `Redis` | `redis:8.2` | Private only, volume at `/data`. Sessions, rate limits and job queues |

On first boot, `railway-seed.mjs` creates a verified owner account from `HEYFORM_ADMIN_EMAIL` and `HEYFORM_ADMIN_PASSWORD`. HeyForm normally asks every new account to verify its email, which needs SMTP. Public sign-up is off. The seed does nothing once any user exists, so later changes to these two variables have no effect.

## Variables (service `heyform`)

| Variable | Default | Purpose |
| --- | --- | --- |
| `HEYFORM_ADMIN_EMAIL` | you enter it | Email of the owner account created on first boot |
| `HEYFORM_ADMIN_PASSWORD` | generated | Its password. Find it in the service's Variables tab |
| `SESSION_KEY`, `FORM_ENCRYPTION_KEY`, `INTEGRATION_ENCRYPTION_KEY` | generated | Session signing, submission encryption, integration credentials. Don't change them after first use |
| `MONGO_URI`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` | references | Private connections to MongoDB and Redis |
| `APP_HOMEPAGE_URL` | `https://${{RAILWAY_PUBLIC_DOMAIN}}` | Public URL used in links and cookies |

Defaults set in `railway-start.sh`, which you can override by adding the variable: `APP_DISABLE_REGISTRATION=true`, `TRUST_PROXY=1`, `APP_LISTEN_PORT=9157`, `NODE_ENV=production`. For email (notifications, invitations, password resets), add `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` and `SMTP_FROM`. The full list is in HeyForm's [environment docs](https://docs.heyform.net/open-source/configuration/environment-variables).

## Updates

The `heyform` service builds from this repo's `main` branch. When a new HeyForm version is tested, the pin in `Dockerfile` is bumped and an entry is added to [CHANGELOG.md](CHANGELOG.md). Railway then shows an "update available" notice on projects deployed from the template, and you choose when to apply it. Read the changelog first, and back up MongoDB before a major version.

## Files

- `Dockerfile`: the pinned upstream image plus the two scripts below
- `railway-start.sh`: sets defaults, starts HeyForm and runs the seed
- `railway-seed.mjs`: creates the owner account on first boot

This is a community-maintained deployment package and does not imply affiliation with or endorsement by HeyForm.
