# react-native-signature-pad

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


-------------------




I am working on porting a capacitor based app to React Native. One of the components I need to re-create is a signature area. Unfortunately the existing components for this are pretty terrible so I decided to create my own. It turned out to be so quick and easy that I saved myself hours of time.

Here is how I created the custom signature pad component:

## Part 1 - Create Web Based Signature Pad

First I added a "webview" folder to the top level of my react native project.

```
mkdir webview
```

Then I started a react (regular react, not react-native) project with vite inside of the webview folder.

```
cd webview
npm create vite@latest
```

I chose "react-signature-pad" as the name, React as the framework, and TypeScript as the variant.

Why vite? My end goal was for the web content to be a single html file (via [vite-plugin-singlefile](https://www.npmjs.com/package/vite-plugin-singlefile)) that is easy to embed in the react native application.

Then inside the react-signature-pad folder I did a bit of cleanup:

```
cd react-signature-pad
rm -Rf rm -Rf src/assets/
rm src/App.css
```

Replace index.css content

```
npm add signature_pad
```


Remove index.css from main.tsx

Create WebSignature.tsx
Update App.tsx

Setup vite-plugin-singlefile

```
npm install vite-plugin-singlefile --save-dev
```

Use instructions from module, but react() instead of vue()

Also tweak vite.config.ts to make output go to ../assets/signature_pad.html instead of dist/index.html

npm run build, will create assets/signature_pad.html

useImperativeHandle - what? Who the hell names things in react. Anyways...

Setup assets

Create MobileSignaturePad.tsx

Didn't have to https://dev.to/somidad/read-text-asset-file-in-expo-356a ???


Should I package this up into an npm package or is it more useful as example code?


