# World ID Setup for TicketHub Mini App

This application uses World ID for user verification at startup. Follow these steps for complete setup.

## 1. Developer Portal Registration

1. Go to [Worldcoin Developer Portal](https://developer.worldcoin.org)
2. Create a new application and set it as "Staging app" for Cloud verification
3. Create a new Action named "verify_human"
4. Note your **App ID** and **Action ID**

## 2. Environment Variables

Create a `.env.local` file with the following content:

```bash
# World ID configuration
NEXT_PUBLIC_WORLDCOIN_APP_ID=your_app_id_here
WORLDCOIN_ACTION_ID=verify_human
```

## 3. Application Features

### World ID Verification
- Application automatically detects if running in World App Mini App environment
- If yes, uses Wallet Auth for wallet login
- If no, displays World ID widget for verification

### Security
- Application requires verification on every startup
- User data is securely stored during session
- Nonce is generated for each authentication

## 4. Running the Application

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

## 5. Testing

### In Browser
- Application will display World ID widget
- Complete verification using World App

### In World App
- Mini app automatically uses Wallet Auth
- Verification happens directly in the app

## 6. Production Deployment

For production deployment:
1. Create production application in Developer Portal
2. Update environment variables
3. Set correct domains in Developer Portal

## API Endpoints

- `GET /api/nonce` - Generates nonce for SIWE
- `POST /api/complete-siwe` - Completes SIWE verification

## Notes

- Application supports both World ID (Orb and Phone) and Wallet Auth
- User interface is in English
- Fully responsive design for mobile and desktop 