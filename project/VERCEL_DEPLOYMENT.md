# Deploying Notun Thikana to Vercel

This guide provides step-by-step instructions for deploying the Notun Thikana application to Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. The [Vercel CLI](https://vercel.com/docs/cli) installed (optional for CLI deployment)
3. A [GitHub](https://github.com) account (for GitHub integration)

## Option 1: Deploy from GitHub

### Step 1: Push your code to GitHub

1. Create a new GitHub repository
2. Push your code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/notun-thikana.git
   git push -u origin main
   ```

### Step 2: Connect to Vercel

1. Log in to your [Vercel dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Select your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

### Step 3: Configure Environment Variables

Add the following environment variables in the Vercel project settings:

```
MONGODB_URI=mongodb+srv://polokpoddar:R7THOg45tgCcOxle@cluster0.kvtm9t5.mongodb.net
NEXTAUTH_SECRET=your-secret-key-for-jwt-signing
NEXTAUTH_URL=https://your-vercel-deployment-url.vercel.app
PUSHER_APP_ID=1731066
PUSHER_KEY=e0004f4f8d3d3e9d8ecc
PUSHER_SECRET=a6c8b5d6d2c3c3c3c3c3
PUSHER_CLUSTER=ap2
```

Replace `your-vercel-deployment-url.vercel.app` with your actual Vercel deployment URL.

### Step 4: Deploy

Click "Deploy" and wait for the deployment to complete.

## Option 2: Deploy using Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Run the deployment check script

```bash
npm run deploy:check
```

This script will check if your project is ready for deployment and create any missing configuration files.

### Step 4: Deploy to Vercel

```bash
vercel
```

Follow the prompts to configure your project:
- Set up and deploy: Yes
- Link to existing project: Select your project or create a new one
- Directory: ./
- Override settings: No

## Post-Deployment Steps

### Step 1: Update NEXTAUTH_URL

After deployment, update the `NEXTAUTH_URL` environment variable in your Vercel project settings to match your deployment URL.

### Step 2: Verify Database Connection

1. Visit your deployed application
2. Sign up for a new account to verify that the database connection is working

### Step 3: Check Real-time Features

1. Create two user accounts
2. Send a friend request from one account to another
3. Accept the friend request
4. Start a conversation to verify that real-time messaging is working

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Verify that the `MONGODB_URI` environment variable is correctly set
2. Check if your IP address is whitelisted in MongoDB Atlas
3. Ensure that the database user has the correct permissions

### Authentication Issues

If authentication is not working:

1. Verify that `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are correctly set
2. Check that `NEXTAUTH_URL` matches your deployment URL
3. Ensure that the database connection is working

### Real-time Messaging Issues

If real-time messaging is not working:

1. Verify that all Pusher environment variables are correctly set
2. Check the browser console for any errors
3. Ensure that your Pusher account is active and the app is properly configured

## Automatic Deployments

Vercel supports automatic deployments when you push changes to your GitHub repository. To enable this:

1. Connect your GitHub repository to Vercel
2. Configure the deployment settings
3. Push changes to your repository to trigger a new deployment

## Custom Domains

To use a custom domain with your Vercel deployment:

1. Go to your project settings in the Vercel dashboard
2. Click on "Domains"
3. Add your custom domain
4. Follow the instructions to configure DNS settings

## Monitoring and Logs

Vercel provides monitoring and logs for your deployment:

1. Go to your project in the Vercel dashboard
2. Click on "Deployments" to see all deployments
3. Click on a specific deployment to view logs and details

## Need Help?

If you encounter any issues with deployment, please refer to the [Vercel documentation](https://vercel.com/docs) or contact support.
