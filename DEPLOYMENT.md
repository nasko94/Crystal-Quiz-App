# 🚀 Deployment Guide

## Vercel (Препоръчително за Next.js)

### 1. Подготовка
```bash
# Build локално за проверка
npm run build
npm start
```

### 2. Deploy с Vercel CLI
```bash
# Инсталирай Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### 3. Deploy през Vercel Dashboard
1. Отидете на [vercel.com](https://vercel.com)
2. Import Git Repository
3. Изберете проекта
4. Configure Project:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Добавете Environment Variables:
   - `OPENAI_API_KEY` или `ANTHROPIC_API_KEY`
   - `SHOPIFY_STORE_DOMAIN`
   - `SHOPIFY_ACCESS_TOKEN`
   - `SHOPIFY_API_VERSION`
   - `NEXT_PUBLIC_APP_URL`
6. Deploy

### 4. Auto Deployments
- Main branch → Production
- Other branches → Preview deployments

---

## Netlify

### Deploy
```bash
# Build
npm run build

# Deploy с Netlify CLI
netlify deploy --prod
```

### Configuration
Създайте `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NEXT_TELEMETRY_DISABLED = "1"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## Custom Server / VPS

### 1. Setup
```bash
# На сървъра
git clone <your-repo>
cd crystal-energy-quiz
npm install
npm run build
```

### 2. PM2 (Process Manager)
```bash
# Инсталирай PM2
npm install -g pm2

# Start
pm2 start npm --name "crystal-quiz" -- start

# Auto-start на boot
pm2 startup
pm2 save
```

### 3. Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. SSL с Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Environment Variables

Уверете се, че следните променливи са настроени:

### Production
- `OPENAI_API_KEY` или `ANTHROPIC_API_KEY`
- `SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_ACCESS_TOKEN`
- `SHOPIFY_API_VERSION=2024-01`
- `NEXT_PUBLIC_APP_URL=https://your-domain.com`
- `NODE_ENV=production`

### Development
- Вижте `ENV_SETUP.md`

---

## Pre-Deployment Checklist

- [ ] Всички зависимости са инсталирани
- [ ] Build преминава успешно локално
- [ ] Environment variables са конфигурирани
- [ ] API endpoints са тествани
- [ ] Mobile responsiveness е проверена
- [ ] Browser compatibility е проверена
- [ ] Analytics са добавени (опционално)
- [ ] Error tracking е настроен (Sentry, LogRocket и т.н.)

---

## Post-Deployment

### Мониторинг
- Vercel Analytics (built-in за Vercel)
- Google Analytics
- Sentry за error tracking

### Performance
- Lighthouse score > 90
- Core Web Vitals проверка
- Image optimization

### SEO
- Meta tags
- Sitemap
- robots.txt

---

## Troubleshooting

### Build Errors
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Environment Variables не работят
- Проверете дали имената са правилни
- За client-side променливи: използвайте `NEXT_PUBLIC_` prefix
- Restart на deployment след промяна

### 404 на routes
- Проверете `next.config.js`
- Уверете се, че има правилен `output` настройка за вашия host

