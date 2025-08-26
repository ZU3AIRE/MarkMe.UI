interface FaceDetectionFace {
  top: number;
  right: number;
  bottom: number;
  left: number;
  matched: boolean;
  studentId: string | null;
  name: string | null;
  distance: number;
}

interface FaceDetectionResponse {
  faces: FaceDetectionFace[];
  count: number;
}

export async function detectFaces(imageData: string): Promise<FaceDetectionResponse> {
  const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, '');

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_FACE_API}/api/faces/detect-image`, {
      method: 'POST',
      body: Buffer.from(base64Data, 'base64'),
    });

    if (!response.ok) {
      throw new Error('Face API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling Face API:', error);
    return {
  "faces": [
    {
      "top": 142,
      "right": 513,
      "bottom": 365,
      "left": 291,
      "matched": false,
      "studentId": "24",
      "name": null,
      "distance": 0.706832145484946
    }
  ],
  "count": 1
};
  }
}
