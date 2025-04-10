import { useEffect, useRef, useImperativeHandle, CSSProperties, forwardRef } from "react";
import SignaturePad from "signature_pad";

export type WebSignaturePadRef = {
  clear: () => void,
  resize: () => void,
  toDataURL: () => string,
  isEmpty: () => boolean,
}

const WebSignaturePad = forwardRef(({ onBeginStroke, onEndStroke, style } : {
    onBeginStroke: () => void,
    onEndStroke: () => void,
    style?: CSSProperties
  }, ref) => {
  const signaturePad = useRef<SignaturePad | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useImperativeHandle(ref, () => ({
    clear: () => {
      signaturePad.current?.clear();
    },
    resize: () => {
      resizeCanvas()
    },
    toDataURL: () => {
      return signaturePad.current?.toDataURL() || ''
    },
    isEmpty: () => {
      if (!signaturePad.current) {
        return true
      }
      return signaturePad.current?.isEmpty()
    }
  }))

  useEffect(() => {
    if (canvasRef.current) {
      signaturePad.current = new SignaturePad(canvasRef.current, {
        backgroundColor: 'rgba(0,0,0,1)',
        penColor: 'rgba(255, 0, 0, 1)'
      });
      signaturePad.current.addEventListener("beginStroke", () => {
        onBeginStroke()
      })
      signaturePad.current.addEventListener("endStroke", () => {
        onEndStroke()
      })
      resizeCanvas()
    }
    window.addEventListener('resize', resizeCanvas)
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  });

  function resizeCanvas() {
    if (canvasRef.current) {
      const ratio =  Math.max(window.devicePixelRatio || 1, 1);
      canvasRef.current.width = canvasRef.current.offsetWidth * ratio;
      canvasRef.current.height = canvasRef.current.offsetHeight * ratio;
      canvasRef.current.getContext("2d")?.scale(ratio, ratio);
    }
    if (signaturePad.current) {
      signaturePad.current.clear(); // otherwise isEmpty() might return incorrect value
    }
  }
  
  return (
    <canvas ref={canvasRef} style={style}></canvas>
  );
})

export default WebSignaturePad
