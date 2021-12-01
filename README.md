# discord.pay v2

**What's New?**
- Now uses Next.js
- You don't need to login with your bot
- New UI
- Now using Tailwind

## How to Clone

**Using Degit**
```bash
npx degit repyh/discord.pay-v2/
```

**Using Git**
```bash
git clone https://github.com/repyh/discord.pay-v2.git
```

## How to Deploy

**Vercel**
1. Clone the repository
2. Edit to fit your bot's config and items to sell
3. Login to [Vercel](https://vercel.com/)
4. Add the repository you cloned
5. Done!

## .env.local Example
```
# Set to 'false' to use live mode

PRODUCTION=false

# https://developer.paypal.com/

PAYPAL_ID=your_paypal_app_id
PAYPAL_SECRET=your_paypal_app_secret
```

## Adding Items/Product
You can edit the `items.js` file to fit your needs.

## Unique ID
Item's name also serves as the unique id for the time being. Might be updated soon.

## Dark Mode
Coming Soon!

## Webhook on Purchase
You can go to `items` folder and make a file named `{item_name}.js`. Export default a function with the parameter where `user_id` will be passed.

## Live Mode
You can change the `PRODUCTION` field in your `.env.local` file to `true`.

## I'm too Lazy
Too lazy to deploy your own? Worry not! Twitco, a platform where bot developers can easily add payment system to their bot is coming next year! (2022)