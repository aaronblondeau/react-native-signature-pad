import { useEffect, useRef, useState } from "react";
// Note that WebSignaturePad is kept in React Native codebase
// to help prevent typescript errors there.
import WebSignaturePad, {
  type WebSignaturePadRef,
} from "../../../components/WebSignaturePad";

const win = window as unknown as {
  ReactNativeWebView?: { postMessage: (msg: string) => void };
  emitSignatureData?: () => void;
  clear?: () => void;
  resize?: () => void;
  emitIsEmpty?: () => void;
};

function App() {
  const [imageData, setImageData] = useState("");
  const signaturePad = useRef<WebSignaturePadRef>(null);

  useEffect(() => {
    // Expose methods to react native webview by attaching them to the window object
    // These methods can be called like this from react native:
    // webview.current?.injectJavaScript("window.clear();")
    win.emitSignatureData = () => {
      if (signaturePad) {
        if (win.ReactNativeWebView) {
          win.ReactNativeWebView.postMessage(
            JSON.stringify({
              signatureDataUrl: signaturePad.current?.toDataURL(),
            }),
          );
        } else {
          console.log("~~ Would emit if react native webview", {
            signatureDataUrl: signaturePad.current?.toDataURL(),
          });
        }
      }
    };
    win.clear = () => {
      signaturePad.current?.clear();
    };
    win.emitIsEmpty = () => {
      if (win.ReactNativeWebView) {
        win.ReactNativeWebView.postMessage(
          JSON.stringify({
            event: "isEmpty",
            isEmpty: signaturePad.current?.isEmpty(),
          }),
        );
      } else {
        console.log("~~ Would emit if react native webview", {
          event: "isEmpty",
          isEmpty: signaturePad.current?.isEmpty(),
        });
      }
    };
  });

  function handleBeginStroke() {
    if (win.ReactNativeWebView) {
      // If we're in a react native webview send to react native via postMessage
      win.ReactNativeWebView.postMessage(
        JSON.stringify({
          event: "beginStroke",
          isEmpty: signaturePad.current?.isEmpty(),
        }),
      );
    } else {
      // Just log to console if running via vite
      console.log("~~ Would emit if react native webview", {
        event: "beginStroke",
        isEmpty: signaturePad.current?.isEmpty(),
      });
    }
  }

  function handleEndStroke() {
    if (win.ReactNativeWebView) {
      // If we're in a react native webview send to react native via postMessage
      win.ReactNativeWebView.postMessage(
        JSON.stringify({
          event: "endStroke",
          isEmpty: signaturePad.current?.isEmpty(),
        }),
      );
    } else {
      // Just log to console if running via vite
      console.log("~~ Would emit if react native webview", {
        event: "endStroke",
        isEmpty: signaturePad.current?.isEmpty(),
      });
    }
  }

  // Don't show the dev/debug buttons when running in a react native webview
  // so that canvas can fill the whole viewport
  const isEmbeded = !!win.ReactNativeWebView;

  function handleDone() {
    setImageData(signaturePad.current?.toDataURL() || "");
  }

  function handleReset() {
    setImageData("");
    signaturePad.current?.clear();
  }

  return (
    <>
      <WebSignaturePad
        ref={signaturePad}
        onBeginStroke={handleBeginStroke}
        onEndStroke={handleEndStroke}
        style={{ width: "100%", height: "100vh" }}
      />
      {!isEmbeded && (
        <div>
          <div>
            <button onClick={handleDone}>Done</button>
            <button onClick={handleReset}>Reset</button>
          </div>
          {imageData && <img src={imageData} />}
        </div>
      )}
    </>
  );
}

export default App;
