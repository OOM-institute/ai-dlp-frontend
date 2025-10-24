# Frontend Deployment Guide

This guide will help you deploy the AI Landing Page Builder frontend to Vercel.

## Prerequisites

- Vercel account
- GitHub repository for the frontend
- Backend API URL (from your backend deployment)

## Deployment Steps

### 1. Push Your Code to GitHub

```bash
git add .
git commit -m "Configure frontend for deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd ai-dlp-frontend
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? ai-dlp-frontend
# - Directory? ./
# - Override settings? No
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `ai-dlp-frontend` (or leave empty if deploying from root)
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Click "Deploy"

### 3. Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variable:

```
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
```

Replace `your-backend.vercel.app` with your actual backend URL.

3. Click "Save"
4. Redeploy your project from the Deployments tab

## Environment Variables

### Development

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Production

Set in Vercel Dashboard:

```env
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
```

## Project Structure

```
ai-dlp-frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main page component
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   └── types/                # TypeScript types
├── public/                   # Static assets
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies
└── .env.example             # Environment variables template
```

## Important Notes

1. **Environment Variables**: Always prefix frontend env vars with `NEXT_PUBLIC_` for them to be accessible in the browser
2. **API URL**: Update `NEXT_PUBLIC_API_URL` in Vercel to point to your deployed backend
3. **CORS**: Backend must allow requests from your frontend domain
4. **Build**: Vercel automatically builds Next.js projects, no manual build needed

## Testing Your Deployment

1. Visit your deployed frontend URL
2. Fill in the form and click "Generate Page"
3. Check browser console for any errors
4. Verify API calls are going to the correct backend URL

## Troubleshooting

### API Connection Issues

- Check `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Verify backend is deployed and accessible
- Check browser console for CORS errors
- Ensure backend CORS allows your frontend domain

### Build Errors

- Check Node.js version compatibility (use Node 18+)
- Review build logs in Vercel dashboard
- Verify all dependencies are in `package.json`

### Environment Variables Not Working

- Ensure variable name starts with `NEXT_PUBLIC_`
- Redeploy after adding environment variables
- Check Vercel dashboard → Settings → Environment Variables

## Monitoring

- View logs in Vercel dashboard under **Deployments** → **Function Logs**
- Monitor usage in **Analytics** tab
- Check build logs for compilation errors

