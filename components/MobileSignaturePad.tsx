import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { Dimensions, ViewStyle } from "react-native";
import { forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Asset } from 'expo-asset';
import { readAsStringAsync } from 'expo-file-system';

export type MobileSignaturePadRef = {
  clear: () => void,
  requestImageData: () => void
}

const MobileSignaturePad = forwardRef(({ onBeginStroke, onEndStroke, onSignatureData, style } : {
    onBeginStroke: () => void,
    onEndStroke: () => void,
    onSignatureData: (data: string) => void,
    style?: ViewStyle
  }, ref) => {

  // Default html to show while signature pad html is loading
  const [sourceHtml, setSourceHtml] = useState(`
    <!DOCTYPE html><html lang="en">
    <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Signature Pad</title>
      </head>
      <body>
        <h1><center>Loading...</center></h1>
      </body>
    </html>
  `)

  const webview = useRef<WebView>(null)

  // https://dev.to/somidad/read-text-asset-file-in-expo-356a
  async function loadSignaturePadHtml() {
    try {
      // signature.html created with : https://www.npmjs.com/package/vite-plugin-singlefile
      // and https://github.com/szimek/signature_pad
      const nodeRequire = require("@/assets/signature_pad.html");
      // https://docs.expo.dev/versions/latest/sdk/asset/
      const asset = Asset.fromModule(nodeRequire);
      await asset.downloadAsync();
      if (asset.localUri) {
        // https://docs.expo.dev/versions/latest/sdk/filesystem/
        const fileContents = await readAsStringAsync(asset.localUri);
        setSourceHtml(fileContents)
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Methods that parent can call
  // Why in the world isn't useImperativeHandle called something better like "expose"?
  useImperativeHandle(ref, () => ({
    clear: () => {
      webview.current?.injectJavaScript("window.clear();")
    },
    requestImageData: () => {
      webview.current?.injectJavaScript("window.emitSignatureData();")
    }
  }))

  // Messages sent from inside the webview go here
  function handleMessage(event: WebViewMessageEvent) {
    const data = JSON.parse(event.nativeEvent.data) as {
      event?: string
      isEmpty?: boolean
      signatureDataUrl?: string
    }

    // Turn messages into calls of prop event handlers
    if (data.event && data.event === 'beginStroke') {
      onBeginStroke()
    }
    if (data.event && data.event === 'endStroke') {
      onEndStroke()
    }
    if (data.signatureDataUrl) {
      onSignatureData(data.signatureDataUrl)
    }
  }

  useEffect(() => {
    loadSignaturePadHtml()
  }, [])

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: sourceHtml }}
      style={style}
      scalesPageToFit={true}
      onMessage={handleMessage}
      ref={webview}
    />
  );
})

export default MobileSignaturePad
