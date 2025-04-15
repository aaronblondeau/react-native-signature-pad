import { Platform, ViewStyle } from "react-native";
import MobileSignaturePad, {
  MobileSignaturePadRef,
} from "@/components/MobileSignaturePad";
import WebSignaturePad, {
  WebSignaturePadRef,
} from "@/components/WebSignaturePad";
import { CSSProperties, forwardRef, useImperativeHandle, useRef } from "react";

export type SignaturePadRef = {
  clear: () => void;
  resize: () => void;
  toDataURL: () => Promise<string>;
  isEmpty: () => Promise<boolean>;
};

const SignaturePad = forwardRef(
  (
    {
      onBeginStroke,
      onEndStroke,
      style,
    }: {
      onBeginStroke: () => void;
      onEndStroke: () => void;
      onSignatureData: (data: string) => void;
      style?: ViewStyle;
    },
    ref,
  ) => {
    const webSignaturePad = useRef<WebSignaturePadRef>(null);
    const mobileSignaturePad = useRef<MobileSignaturePadRef>(null);
    const toDataUrlResolves = useRef<((data: string) => void)[]>([]);
    const isEmptyResolves = useRef<((isEmpty: boolean) => void)[]>([]);

    useImperativeHandle(ref, () => ({
      clear: () => {
        if (webSignaturePad.current) {
          webSignaturePad.current.clear();
        }
        if (mobileSignaturePad.current) {
          mobileSignaturePad.current.clear();
        }
      },
      resize: () => {
        if (webSignaturePad.current) {
          webSignaturePad.current.resize();
        }
        if (mobileSignaturePad.current) {
          mobileSignaturePad.current.resize();
        }
      },
      toDataURL: async () => {
        if (webSignaturePad.current) {
          return webSignaturePad.current.toDataURL();
        }
        if (mobileSignaturePad.current) {
          //  Make this call look like a promise to caller
          const tempPromise = new Promise((resolve) => {
            toDataUrlResolves.current.push(resolve);
          });
          // Ask webview content to send up image data
          mobileSignaturePad.current.requestImageData();
          return tempPromise;
        }
      },
      isEmpty: async () => {
        if (webSignaturePad.current) {
          return webSignaturePad.current.isEmpty();
        }
        if (mobileSignaturePad.current) {
          //  Make this call look like a promise to caller
          const tempPromise = new Promise((resolve) => {
            isEmptyResolves.current.push(resolve);
          });
          // Ask webview content to send up isEmpty status
          mobileSignaturePad.current.requestIsEmpty();
          return tempPromise;
        }
      },
    }));

    function handleBeginStroke() {
      // Proxy to parent
      onBeginStroke();
    }

    function handleEndStroke() {
      // Proxy to parent
      onEndStroke();
    }

    function handleSignatureData(data: string) {
      // Only comes from mobileSignaturePad, resolve pending promises with value
      toDataUrlResolves.current.forEach((resolve) => {
        resolve(data);
      });
      toDataUrlResolves.current = [];
    }

    function handleIsEmpty(isEmpty: boolean) {
      // Only comes from mobileSignaturePad, resolve pending promises with value
      isEmptyResolves.current.forEach((resolve) => {
        resolve(isEmpty);
      });
      isEmptyResolves.current = [];
    }

    if (Platform.OS === "web") {
      // Note more advanced code to convert react native style to web style may be needed here
      return (
        <WebSignaturePad
          ref={webSignaturePad}
          onBeginStroke={handleBeginStroke}
          onEndStroke={handleEndStroke}
          style={style as CSSProperties}
        />
      );
    } else {
      return (
        // Note, flex 0 is added to prevent an invisible webview
        <MobileSignaturePad
          ref={mobileSignaturePad}
          onBeginStroke={handleBeginStroke}
          onEndStroke={handleEndStroke}
          onSignatureData={handleSignatureData}
          onIsEmpty={handleIsEmpty}
          style={{ ...style }}
        />
      );
    }
  },
);

export default SignaturePad;
