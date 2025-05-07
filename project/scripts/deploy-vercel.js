/**
 * Vercel Deployment Helper Script
 * 
 * This script helps prepare the project for Vercel deployment.
 * It checks for required environment variables and creates necessary files.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env.local');
const envExamplePath = path.join(__dirname, '..', '.env.example');

// Function to check if required environment variables are set
function checkEnvVariables() {
  console.log('Checking environment variables...');
  
  const requiredVars = [
    'MONGODB_URI',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'PUSHER_APP_ID',
    'PUSHER_KEY',
    'PUSHER_SECRET',
    'PUSHER_CLUSTER'
  ];
  
  let missingVars = [];
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    requiredVars.forEach(varName => {
      if (!envContent.includes(`${varName}=`)) {
        missingVars.push(varName);
      }
    });
  } else {
    console.log('No .env.local file found. Creating from .env.example...');
    
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log('.env.local created from .env.example');
      console.log('Please update the values in .env.local before deploying');
    } else {
      console.error('No .env.example file found. Please create a .env.local file manually.');
      missingVars = requiredVars;
    }
  }
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`- ${varName}`);
    });
    console.error('Please add these variables to your .env.local file or Vercel environment variables.');
    return false;
  }
  
  console.log('All required environment variables are set.');
  return true;
}

// Function to check if vercel.json exists and is properly configured
function checkVercelConfig() {
  console.log('Checking Vercel configuration...');
  
  const vercelConfigPath = path.join(__dirname, '..', 'vercel.json');
  
  if (!fs.existsSync(vercelConfigPath)) {
    console.error('vercel.json not found. Creating default configuration...');
    
    const defaultConfig = {
      "version": 2,
      "framework": "nextjs",
      "public": true,
      "env": {
        "MONGODB_URI": "mongodb+srv://polokpoddar:R7THOg45tgCcOxle@cluster0.kvtm9t5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        "NEXTAUTH_SECRET": "your-secret-key-for-jwt-signing",
        "NEXTAUTH_URL": "https://project-660ipemrg-proloypoddars-projects.vercel.app",
        "PUSHER_APP_ID": "1731066",
        "PUSHER_KEY": "e0004f4f8d3d3e9d8ecc",
        "PUSHER_SECRET": "a6c8b5d6d2c3c3c3c3c3",
        "PUSHER_CLUSTER": "ap2"
      },
      "headers": [
        {
          "source": "/(.*)",
          "headers": [
            {
              "key": "Access-Control-Allow-Origin",
              "value": "*"
            },
            {
              "key": "Access-Control-Allow-Methods",
              "value": "GET, POST, PUT, DELETE, OPTIONS"
            },
            {
              "key": "Access-Control-Allow-Headers",
              "value": "X-Requested-With, Content-Type, Accept"
            }
          ]
        }
      ]
    };
    
    fs.writeFileSync(vercelConfigPath, JSON.stringify(defaultConfig, null, 2));
    console.log('Default vercel.json created. Please update the values before deploying.');
    return false;
  }
  
  console.log('vercel.json found.');
  return true;
}

// Function to check if the project is ready for deployment
function checkDeploymentReadiness() {
  console.log('Checking deployment readiness...');
  
  const envVarsReady = checkEnvVariables();
  const vercelConfigReady = checkVercelConfig();
  
  if (envVarsReady && vercelConfigReady) {
    console.log('Project is ready for deployment to Vercel!');
    console.log('To deploy, run:');
    console.log('  vercel');
    console.log('Or connect your GitHub repository to Vercel for automatic deployments.');
    return true;
  } else {
    console.log('Project is not ready for deployment. Please fix the issues above.');
    return false;
  }
}

// Run the checks
checkDeploymentReadiness();
