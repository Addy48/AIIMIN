# GitHub Actions — Deploy API to EC2

Workflow: `.github/workflows/deploy-api.yml`

## Required secrets

| Secret | Value |
|--------|--------|
| `EC2_HOST` | `13.207.146.15` (Elastic IP) |
| `EC2_SSH_KEY` | Full contents of `aiimin.pem` (including `BEGIN`/`END` lines) |

Repo → **Settings → Secrets and variables → Actions**

## Common failures

### `fatal: not a git repository`

`~/AIIMIN` was rsync-deployed without `.git`. Fixed in workflow: auto-clones if missing (preserves `.env`).

### `dial tcp ***:22: i/o timeout`

GitHub Actions runners use **random IPs**. EC2 security group must allow **SSH (22)** from:

- `0.0.0.0/0` (simplest), or
- [GitHub Actions IP ranges](https://api.github.com/meta) (updated periodically)

AWS Console → EC2 → Security Groups → `aiimin-api-sg` → Inbound → SSH 22.

### `npm ci` / install hangs or OOM

t4g.nano has 512MB RAM. Workflow uses `npm install --omit=dev --ignore-scripts` with `NODE_OPTIONS=--max-old-space-size=384`.

### Manual deploy on EC2

```bash
bash ~/AIIMIN/deploy/github-ec2-deploy.sh
```

### Manual deploy from Mac

```bash
bash deploy/rsync-to-ec2.sh 13.207.146.15 "/Users/aaditya/Desktop/aiimin.pem"
ssh -i "/Users/aaditya/Desktop/aiimin.pem" ubuntu@13.207.146.15 \
  "cd ~/AIIMIN && pm2 reload deploy/ecosystem.config.cjs --update-env"
```
