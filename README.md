
# CompeteAI - Deployment Instructions

Follow these steps to get your app live on Vercel:

## 1. Commit and Push to GitHub
Make sure you are on your `atwork` branch and push the latest changes:
```bash
git add .
git commit -m "Optimize for Vercel deployment"
git push origin atwork
```

## 2. Connect to Vercel
1. Go to [Vercel](https://vercel.com) and log in.
2. Click **Add New** > **Project**.
3. Import your GitHub repository.
4. **Environment Variables (CRITICAL)**:
   - In the "Environment Variables" section, add a new key named `API_KEY`.
   - Set the value to your Gemini API Key.
5. Click **Deploy**.

## 3. Verify
Once deployed, Vercel will provide a `.vercel.app` URL. Your forensic audit system is now live!
