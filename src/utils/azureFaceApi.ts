interface FaceDetectionResponse {
  faceId: string;
  faceRectangle: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  faceAttributes?: {
    age: number;
    gender: string;
    smile?: number;
    headPose?: {
      pitch: number;
      roll: number;
      yaw: number;
    };
    emotion?: {
      anger: number;
      contempt: number;
      disgust: number;
      fear: number;
      happiness: number;
      neutral: number;
      sadness: number;
      surprise: number;
    };
    [key: string]: number | string | object | undefined;
  };
}

const AZURE_FACE_KEY = ' '
const AZURE_FACE_ENDPOINT = ''

const PERSON_GROUP_ID = 'myfacegroup';
const API_ENDPOINT = AZURE_FACE_ENDPOINT;
const API_KEY = AZURE_FACE_KEY;

export async function detectFaces(imageFile: File): Promise<FaceDetectionResponse[]> {
  const formData = new FormData();
  formData.append('image', imageFile, imageFile.name);

  try {
    const response = await fetch('https://linux-python-face-api.azurewebsites.net/api/faces/detect-image', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        // Do not set Content-Type, browser will set it for multipart/form-data
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Face API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling Face API:', error);
    return [];
  }
}

async function createPersonGroup() {
  try {
    const response = await fetch(
      `${API_ENDPOINT}/face/v1.0/persongroups/${PERSON_GROUP_ID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': API_KEY,
        },
        body: JSON.stringify({
          name: 'My Face Group',
          userData: 'Group containing my face data'
        })
      }
    );
    return response.ok;
  } catch (error) {
    console.error('Error creating person group:', error);
    return false;
  }
}

async function createPerson() {
  try {
    const response = await fetch(
      `${API_ENDPOINT}/face/v1.0/persongroups/${PERSON_GROUP_ID}/persons`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': API_KEY,
        },
        body: JSON.stringify({
          name: 'Me',
          userData: 'My face data'
        })
      }
    );
    const data = await response.json();
    return data.personId;
  } catch (error) {
    console.error('Error creating person:', error);
    return null;
  }
}

async function addFaceToPerson(personId: string) {
  try {
    const response = await fetch(
      `${API_ENDPOINT}/face/v1.0/persongroups/${PERSON_GROUP_ID}/persons/${personId}/persistedFaces`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': API_KEY,
        },
        body: JSON.stringify({
          url: 'https://github.com/ZU3AIRE.png'
        })
      }
    );
    return response.ok;
  } catch (error) {
    console.error('Error adding face:', error);
    return false;
  }
}

// Main function to setup face
async function setupMyFace() {
    const groupCreated = await createPersonGroup();
    if (!groupCreated) return false;
    
    const personId = await createPerson();
    if (!personId) return false;
    console.log(personId)
    
  const faceAdded = await addFaceToPerson(personId);
  if (!faceAdded) return false;
  
  return true;
}

// Export functions
export {
  setupMyFace,
  createPersonGroup,
  createPerson,
  addFaceToPerson
};
