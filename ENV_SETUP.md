# Environment Variables Setup

Създайте `.env.local` файл в root директорията на проекта със следните променливи:

```bash
# AI Configuration (избери един)
OPENAI_API_KEY=your_openai_api_key_here
# or
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Shopify Configuration
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_shopify_access_token
SHOPIFY_API_VERSION=2024-01

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Как да получите ключовете:

### OpenAI API Key
1. Отидете на https://platform.openai.com/
2. Sign in или създайте акаунт
3. Навигирайте до API Keys
4. Създайте нов Secret Key

### Shopify Access Token
1. Влезте в Shopify Admin
2. Settings → Apps and sales channels → Develop apps
3. Create an app
4. Configure Admin API scopes (orders_write, products_read)
5. Install app и копирайте Admin API access token

## Важно
- `.env.local` файлът е в `.gitignore` и няма да се качи в Git
- Никога не споделяйте вашите API ключове публично
- За production използвайте environment variables на вашия hosting provider

