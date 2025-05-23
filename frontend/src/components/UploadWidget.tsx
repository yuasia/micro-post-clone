import { useEffect, useRef } from "react";
import styled from "styled-components";

type UploadWidgetProps = {
  setAvatarUrl: (url: string) => void;
};

declare global {
  interface Window {
    cloudinary: any;
  }
}

const UploadWidget = ({ setAvatarUrl }: UploadWidgetProps) => {
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
          setAvatarUrl(result.info.secure_url);
        }
      }
    );
  }, []);

  return (
    <SRButton onClick={() => widgetRef.current.open()}>
      画像をアップロード
    </SRButton>
  );
};

export default UploadWidget;

const SRButton = styled.button`
  width: 50%;
  height: 60px;
  background: white;
  border: 1px solid #444444;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: #444444;
  transition: background 0.3s;

  &:hover {
    background: #444444;
    color: white;
  }
`;
