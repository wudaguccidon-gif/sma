# CompeteAI - Live Deployment Fix

If you are seeing the "Strategic Access Required" screen or if audits fail on your live site, follow these steps:

## 1. Add your API Key to Vercel
1. Log in to the [Vercel Dashboard](https://vercel.com).
2. Click on your project (`sma-indol` or similar).
3. Go to **Settings** > **Environment Variables**.
4. Add a new variable:
   - **Key**: `API_KEY`
   - **Value**: *[Paste your Gemini API Key here]*
5. Click **Save**.

## 2. Redeploy
For the changes to take effect, you must trigger a new deployment:
1. Go to the **Deployments** tab in Vercel.
2. Click the three dots `...` on your latest deployment.
3. Select **Redeploy**.

## 3. Verify
Once the redeploy finishes, refresh your live URL. The app will land directly on the Dashboard, and the "Initialize Probe" button will now have the necessary intelligence to function.
