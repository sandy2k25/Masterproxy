# DomCloud Troubleshooting Guide

## Error: Cannot find module '/home/user/public_html/dist/src/index.js'

This is the most common DomCloud deployment error. Here's how to fix it:

### The Problem
DomCloud is looking for the file in the wrong location. The error shows it's trying to find:
```
/home/user/public_html/dist/src/index.js
```

But your build creates the file at:
```
/home/user/public_html/dist/index.js
```

### The Solution

1. **Check your `.domcloud` configuration**:
   ```yaml
   features:
     - node lts
   nginx:
     root: public_html/dist/public
     passenger:
       enabled: "on"
       app_start_command: env PORT=$PORT node index.js
       app_env: production
       app_root: public_html/dist  # This is crucial!
   commands:
     - npm install --production
     - npm run build
   ```

2. **Key points**:
   - `app_root: public_html/dist` - Sets the working directory
   - `app_start_command: env PORT=$PORT node index.js` - Runs the file from the app_root
   - `root: public_html/dist/public` - Serves static files from the public directory

### Step-by-Step Fix

1. **Verify your build works locally**:
   ```bash
   npm run build
   ls -la dist/
   # Should show: index.js and public/ directory
   ```

2. **Upload the correct `.domcloud` file**:
   - Copy the `.domcloud` file to your DomCloud root directory
   - Ensure it has the exact configuration shown above

3. **Trigger a redeploy**:
   - In DomCloud panel, go to "Deployments" 
   - Click "Deploy" to rebuild with the new configuration
   - Or use the deployment script feature

4. **Check the deployment logs**:
   - Look for "npm run build" completion
   - Verify Node.js LTS version is being used
   - Confirm no build errors

### Manual File Check

If you have SSH access, verify the files exist:
```bash
# SSH into your DomCloud account
cd public_html
ls -la dist/
# Should show:
# - index.js (your server file)
# - public/ (directory with frontend files)
```

### Alternative: Quick Fix

If the automated deployment isn't working:

1. **Build locally**:
   ```bash
   npm install
   npm run build
   ```

2. **Upload the `dist/` folder** manually via DomCloud file manager

3. **Create a simple startup script**:
   ```yaml
   # .domcloud
   features:
     - node lts
   nginx:
     root: public_html/dist/public
     passenger:
       enabled: "on"
       app_start_command: env PORT=$PORT node /home/user/public_html/dist/index.js
       app_env: production
   ```

## Other Common Issues

### Memory Issues
```
Error: JavaScript heap out of memory
```
**Solution**: Upgrade to a higher DomCloud plan with more RAM.

### Port Binding Issues
```
Error: listen EADDRINUSE
```
**Solution**: Ensure you're using `process.env.PORT` in your code, not a hardcoded port.

### Permission Issues
```
Error: EACCES: permission denied
```
**Solution**: Check file permissions in DomCloud file manager, ensure execute permissions on scripts.

### Build Tool Issues
```
Error: vite: command not found
```
**Solution**: Install build dependencies:
```yaml
commands:
  - npm install  # Install ALL dependencies, not just --production
  - npm run build
```

## Getting Help

If you're still having issues:

1. **Check DomCloud logs**: Go to your website dashboard → Logs
2. **Test locally first**: Ensure `npm run build && npm start` works locally
3. **Contact DomCloud support**: Provide the exact error message and your `.domcloud` file
4. **Use the setup script**: Run `bash domcloud-setup.sh` to verify your build

Your M3U8 proxy should work perfectly on DomCloud once the file paths are correct!