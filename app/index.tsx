import { Button, Image, View, Text } from "react-native";
import { useRef, useState } from "react";
import SignaturePad, { SignaturePadRef } from "@/components/SignaturePad";

export default function Index() {
  const [imageData, setImageData] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const signaturePad = useRef<SignaturePadRef>(null);

  // Not doing anything with these yet...
  function handleBeginStroke() {
    setIsDrawing(true);
  }

  function handleEndStroke() {
    setIsDrawing(false);
  }

  async function handleDone() {
    if (signaturePad.current) {
      const imageData = await signaturePad.current.toDataURL();
      setImageData(imageData);
    }
  }

  function handleReset() {
    signaturePad.current?.clear();
    setImageData("");
  }

  function handleSignatureData(data: string) {
    setImageData(data);
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <View style={{ height: 250, width: 550 }}>
        {/* WebView is naughty and won't size itself like other components. Wrapping it with a view helps. */}
        <SignaturePad
          ref={signaturePad}
          onBeginStroke={handleBeginStroke}
          onEndStroke={handleEndStroke}
          onSignatureData={handleSignatureData}
          style={{ height: 250, width: 550 }}
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button title="Done" onPress={handleDone} disabled={isDrawing} />
        <Button title="Reset" onPress={handleReset} disabled={isDrawing} />
      </View>
      {imageData && (
        <View
          style={{
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Text>Signature Data:</Text>
          <Image
            resizeMode="contain"
            style={{ height: 250, width: 250 }}
            source={{ uri: imageData }}
          />
        </View>
      )}
    </View>
  );
}
