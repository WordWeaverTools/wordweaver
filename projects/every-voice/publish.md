# EveryVoice plugin for Angular publication

The every-voice plugin is published to npmjs.com as `@everyvoice/every-voice` here:

https://www.npmjs.com/package/@everyvoice/every-voice

## 📦 Publishing a new version of the package

1. Udpate `version` in [projects/every-voice/package.json](./package.json), commit and push to `origin/main`.

2. If you have not done so already, install everything from the root of the `wordweaver` monorepo:

   ```bash
   npm install
   ```

3. Build the @everyvoice/every-voice plugin, again from the monorepo root:

   ```bash
   npm run build-ev
   ```

4. Go into the dist folder just created:

   ```bash
   cd dist/every-voice
   ```

5. Do a dry run and address any warnings:

   ```bash
   npm publish --dry-run
   ```

6. Publish

   ```bash
   npm publish
   ```

   This command should prompt you to login to npmjs.com as necessary.

   Note: this step can only be done by an administrator of the package on npmjs.

7. Tag the version

   This is important, because we want to know later which repo version was used to create each published version of the package.  Make sure you've checked out the commit you actually published before tagging!

   Replace `x.y.z` with the actual version you declared in [package.json](package.json) and published:
   ```bash
   git tag -a -m '@everyvoice/every-voice npmjs plugin version x.y.z' every-voice/x.y.z
   git push origin every-voice/x.y.z
   ```
