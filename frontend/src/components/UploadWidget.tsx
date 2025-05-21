import { useEffect, useRef } from "react";

declare global {
  interface Window {
    cloudinary: any;
  }
}

const UploadWidget = () => {
  const cloudinaryRef = useRef<any>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dy7imnrkj",
        uploadPreset: "ml_default",
      },
      function (error: any, result: any) {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
        }
      }
    );
  }, []);

  return (
    <button onClick={() => widgetRef.current.open()}>画像をアップロード</button>
  );
};

export default UploadWidget;
