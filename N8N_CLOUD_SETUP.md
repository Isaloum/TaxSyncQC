# Quick Setup Guide for n8n Cloud

## You Have: n8n Cloud at https://isaloum85.app.n8n.cloud ✅

## Step 1: Import the Workflow

### Option A: Import from File (Easiest)

1. **Download** the workflow file from your repo:
   - Go to: https://github.com/Isaloum/TaxSyncQC
   - Find: `n8n-workflow-example.json`
   - Download it

2. **Import to n8n:**
   - Log into: https://isaloum85.app.n8n.cloud
   - Click **"Workflows"** in left sidebar
   - Click **"Add workflow"** → **"Import from file"**
   - Upload `n8n-workflow-example.json`

### Option B: Create Manually

If import doesn't work, create a new workflow with 3 nodes:

**Node 1: Webhook Trigger**
- Type: Webhook
- HTTP Method: POST
- Path: `parse-tax-slip`
- Respond: Using 'Respond to Webhook' Node

**Node 2: Code**
- Type: Code
- Mode: Run Once for All Items
- Copy the JavaScript from `n8n-workflow-example.json` lines 20-21 (the big jsCode block)

**Node 3: Respond to Webhook**
- Respond With: JSON
- Add Header: `Access-Control-Allow-Origin` = `*`
- Add Header: `Content-Type` = `application/json`

## Step 2: Activate the Workflow

1. Click the **toggle switch** in top right corner
2. Should turn GREEN
3. The webhook is now live!

## Step 3: Get Your Webhook URL

1. Click on the **Webhook node** (first one)
2. Look for **"Production URL"** or **"Webhook URLs"**
3. Copy the URL (looks like):
   ```
   https://isaloum85.app.n8n.cloud/webhook/parse-tax-slip
   ```
   OR
   ```
   https://isaloum85.app.n8n.cloud/webhook-test/parse-tax-slip
   ```

## Step 4: Test on Your Live Site

1. Open: **https://Isaloum.github.io/TaxSyncQC**

2. Scroll down to **"🔗 Connect to n8n"** section

3. Paste your webhook URL in the field

4. In the text area, paste this sample:
   ```
   RELEVÉ 1 - REVENUS D'EMPLOI 2025

   Case A - Revenus d'emploi: 60 000,00 $
   Case F - Cotisations syndicales: 425,00 $
   REER: 5 000 $
   ```

5. Click **"🚀 Send to n8n"**

6. Click **"⬇️ Apply parsed fields"**

7. Click **"Estimer les crédits"**

8. See your results! 🎉

## Expected Result:
- Total Benefit: ~$5,802
- Cash Refund: ~$728

## Troubleshooting

**If "Send to n8n" shows error:**
- Make sure workflow is ACTIVATED (green toggle)
- Check webhook URL is correct
- Try the webhook URL directly in browser (should show JSON response)

**If nothing happens:**
- Open browser console (F12)
- Look for error messages
- Share the error with me

---

**Once you have your webhook URL, just tell me and I'll help test it!**
