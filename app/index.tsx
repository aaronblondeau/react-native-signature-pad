import {Button, Image, Platform, Dimensions, View } from "react-native";
import MobileSignaturePad, { MobileSignaturePadRef } from "@/components/MobileSignaturePad";
import WebSignaturePad, { WebSignaturePadRef } from "@/components/WebSignaturePad";
import { useRef, useState } from "react";

export default function Index() {
  const [imageData, setImageData] = useState('')
  const webSignaturePad = useRef<WebSignaturePadRef>(null)
  const mobileSignaturePad = useRef<MobileSignaturePadRef>(null)

  // Not doing anything with these yet...
  function handleBeginStroke () {
    console.log('~~ handleBeginStroke')
  }

  function handleEndStroke() {
    console.log('~~ handleEndStroke')
  }

  function handleDone() {
    if (webSignaturePad.current) {
      setImageData(webSignaturePad.current.toDataURL())
    }
    if (mobileSignaturePad.current) {
      mobileSignaturePad.current.requestImageData()
    }
  }

  function handleReset() {
    if (webSignaturePad.current) {
      webSignaturePad.current.clear()
    }
    if (mobileSignaturePad.current) {
      mobileSignaturePad.current.clear()
    }
    setImageData('')
  }

  function handleSignatureData(data: string) {
    setImageData(data)
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      { Platform.OS === 'web' && 
      <WebSignaturePad 
        ref={webSignaturePad} 
        onBeginStroke={handleBeginStroke} 
        onEndStroke={handleEndStroke}
        style={{ height: 250, width: 250 }}
      />}
      { Platform.OS !== 'web' && 
      <MobileSignaturePad
        ref={mobileSignaturePad}
        onBeginStroke={handleBeginStroke}
        onEndStroke={handleEndStroke}
        onSignatureData={handleSignatureData}
        style={{ height: 250, width: 250, flex: 0 }}
      />}
      <Button title="Done" onPress={handleDone} />
      <Button title="Reset" onPress={handleReset} />
      {imageData && (
        <Image
          resizeMode="contain"
          style={{ height: 250, width: 250, flex: 1 }}
          source={{ uri: imageData }}
        />
      )}
    </View>
  );
}
