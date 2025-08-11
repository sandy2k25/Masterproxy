# DomCloud Quick Fix for Path Error

## Common DomCloud Errors and Quick Fixes

### Error 1: Cannot find module '/home/username/public_html/dist/src/index.js'
### Error 2: Couldn't read package.json

**Quick Solution for immediate deployment:**

### Step 1: Update .domcloud file

Replace your `.domcloud` file content with this **exact configuration**:

```yaml
features:
  - node lts
nginx:
  root: public_html/dist/public
  passenger:
    enabled: "on"
    app_start_command: env PORT=$PORT node /home/heavy/public_html/dist/index.js
    app_env: production
commands:
  - npm install --production
  - npm run build
```

### Step 2: Verify Build Files

Check that these files exist on your DomCloud server:
- `/home/heavy/public_html/dist/index.js` ✅ (main server file)
- `/home/heavy/public_html/dist/public/` ✅ (frontend files)

### Step 3: Force Redeploy

In your DomCloud control panel:
1. Go to **File Manager**
2. Upload the updated `.domcloud` file
3. Go to **Deployment** → **Deploy Now**
4. Or use the **Restart** button in the control panel

### Alternative: Manual Path Fix

If the above doesn't work, try this alternative `.domcloud` configuration:

```yaml
features:
  - node lts
commands:
  - npm install --production
  - npm run build
  - cd /home/heavy/public_html/dist && PORT=$PORT node index.js &
```

### Verification Steps

1. **Check if files exist**:
   ```bash
   ls -la /home/heavy/public_html/dist/
   # Should show: index.js and public/ directory
   ```

2. **Test the server manually**:
   ```bash
   cd /home/heavy/public_html/dist
   PORT=3000 node index.js
   ```

3. **Check process**:
   ```bash
   ps aux | grep node
   # Should show your Node.js process running
   ```

### Root Cause

The error happens because:
- DomCloud is looking for: `/home/heavy/public_html/dist/src/index.js`
- But the file is actually at: `/home/heavy/public_html/dist/index.js`
- The build process creates `dist/index.js`, not `dist/src/index.js`

### Final Notes

- Your username is `heavy` based on the error message
- The absolute path `/home/heavy/public_html/dist/index.js` should work
- Make sure to rebuild after configuration changes
- DomCloud uses Passenger to manage Node.js apps

### Fix for "Couldn't read package.json" Error

This error occurs when DomCloud can't find or read your package.json file.

**Solution Steps:**

1. **Verify file upload**: Ensure `package.json` is in your root directory
2. **Check file permissions**: Make sure package.json is readable
3. **Use debug commands** in `.domcloud`:

```yaml
features:
  - node lts
nginx:
  root: public_html/dist/public
  passenger:
    enabled: "on"
    app_start_command: env PORT=$PORT node /home/heavy/public_html/dist/index.js
    app_env: production
commands:
  - ls -la
  - cat package.json
  - npm install --production
  - npm run build
  - ls -la dist/
```

4. **Manual upload**: If automatic deployment fails:
   - Upload all files via DomCloud File Manager
   - Ensure `package.json` is in the root directory
   - Check that file contents are not corrupted

5. **Alternative deployment** without package.json dependency:
```yaml
features:
  - node lts
commands:
  - wget https://nodejs.org/dist/latest-v20.x/node-v20.11.0-linux-x64.tar.xz
  - cd /home/heavy/public_html && tar -xf node-*.tar.xz --strip-components=1
  - export PATH=/home/heavy/public_html/bin:$PATH
  - cd /home/heavy/public_html/dist && PORT=$PORT node index.js &
```

This should resolve both the path issue and package.json reading problems immediately!