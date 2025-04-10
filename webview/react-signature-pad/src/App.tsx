import { useEffect, useRef, useState } from 'react'
import WebSignaturePad, { type WebSignaturePadRef } from '../../../components/WebSignaturePad'

const win = window as unknown as { ReactNativeWebView?: {postMessage: (msg: string) => void}, emitSignatureData?: () => void, clear?: () => void }

function App() {
  const [imageData, setImageData] = useState('');
  const signaturePad = useRef<WebSignaturePadRef>(null)

  useEffect(() => {
    win.emitSignatureData = () => {
      if (signaturePad) {
        if (win.ReactNativeWebView) {
          win.ReactNativeWebView.postMessage(JSON.stringify({
            signatureDataUrl: signaturePad.current?.toDataURL()
          }))
        } else {
          console.log('~~ Would emit if react native webview', {
            signatureDataUrl: signaturePad.current?.toDataURL()
          })
        }
      }
    }
    win.clear = () => {
      signaturePad.current?.clear()
    }
  })

  function handleBeginStroke () {
    if (win.ReactNativeWebView) {
      win.ReactNativeWebView.postMessage(JSON.stringify({
        event: 'beginStroke',
        isEmpty: signaturePad.current?.isEmpty()
      }))
    } else {
      console.log('~~ Would emit if react native webview', {
        event: 'beginStroke',
        isEmpty: signaturePad.current?.isEmpty()
      })
    }
  }

  function handleEndStroke() {
    if (win.ReactNativeWebView) {
      win.ReactNativeWebView.postMessage(JSON.stringify({
        event: 'endStroke',
        isEmpty: signaturePad.current?.isEmpty()
      }))
    } else {
      console.log('~~ Would emit if react native webview', {
        event: 'endStroke',
        isEmpty: signaturePad.current?.isEmpty()
      })
    }
  }

  function handleDone() {
    setImageData(signaturePad.current?.toDataURL() || '')
  }

  function handleReset() {
    setImageData('')
    signaturePad.current?.clear()
  }

  return (
    <>
      <div>
        <WebSignaturePad
          ref={signaturePad}
          onBeginStroke={handleBeginStroke}
          onEndStroke={handleEndStroke}
          style={{width: 400, height: 400}}
        />
      </div>
      <div>
        <button onClick={handleDone}>Done</button>
        <button onClick={handleReset}>Reset</button>
      </div>
      { imageData && <img src={imageData} />}
    </>
  )
}

export default App
