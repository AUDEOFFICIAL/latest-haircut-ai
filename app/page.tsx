"use client"; // This tells Next.js this page is interactive
import { useState } from 'react';

export default function HaircutApp() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  // 1. Function to handle image upload
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  // 2. Logic to "Analyze" (The Matchmaker)
  const analyzeFace = async () => {

    console.log("Checking Key:", process.env.NEXT_PUBLIC_FACEPP_KEY);

    if (!image) return alert("Please upload a photo first!");

    try {
    // For now, we simulate an AI finding a "Square" face
    const formData = new FormData();
    formData.append('api_key', process.env.NEXT_PUBLIC_FACEPP_KEY!);
    formData.append('api_secret', process.env.NEXT_PUBLIC_FACEPP_SECRET!);
    formData.append('return_attributes', 'face_shape');

    const blob = await fetch(image).then(r => r.blob());
    formData.append('image_file', blob);

    const response = await fetch('https://api-cn.faceplusplus.com/facepp/v3/detect', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    const detectedShape = data.faces[0].attributes.face_shape.shape;
    
    const styles: any = {
      square: { name: "Textured Quiff", desc: "Short sides with volume on top softens your jawline." },
      oval: { name: "Classic Side Part", desc: "Anything works for you, but this looks the sharpest." },
      round: { name: "Pompadour", desc: "Height on top makes your face appear longer." },
      heart: { name: "Long Fringe", desc: "Adds width to your forehead to balance a narrow chin."}
    };

    setResult(styles[detectedShape] || { name: "Cool Cut", desc: "The AI says you have a unique look!" });

  } catch (error) {
    console.error("AI Error:", error);
    alert("The AI is taking a break. Check your API keys!");
  }
  };

  return (
    <main className="p-10 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold text-blue-600">AI Haircut Guide</h1>
      
      {/* Upload Section */}
      <input type="file" onChange={handleUpload} className="border p-2" />
      
      {/* Preview Image */}
      {image && <img src={image} alt="User face" className="w-64 h-64 object-cover rounded-lg" />}

      {/* Action Button */}
      <button 
        onClick={analyzeFace}
        className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800"
      >
        Find My Style
      </button>

      {/* Results Section */}
      {result && (
        <div className="mt-6 p-4 border-2 border-green-500 rounded-xl text-center">
          <h2 className="text-2xl font-bold">{result.name}</h2>
          <p className="text-gray-600">{result.desc}</p>
        </div>
      )}
    </main>
  );
}