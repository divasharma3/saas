# saas-docs
 
```env
# Kinde for secure, fast authentication - https://link.joshtriedcoding.com/kinde
KINDE_CLIENT_ID=
KINDE_CLIENT_SECRET=
KINDE_ISSUER_URL=https://<kinde-domain>.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard

# Database for storing everything except PDF files - (Provider up to you, I like PlanetScale)
DATABASE_URL=

# Uploadthing for storing PDF files - https://uploadthing.com/dashboard
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

REPLICATE_API_TOKEN=

# Stripe for payment processing - https://stripe.com/
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```
