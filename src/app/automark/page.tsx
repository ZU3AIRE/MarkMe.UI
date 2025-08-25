import { auth } from "@clerk/nextjs/server";
import AutoMarkPage from "@/components/automark/AutoMarkPage";

export default async function UploadFaceImage() {
        const { getToken } = await auth();
        const token = await getToken({ template: 'mark_me_backend_api' });
        if (token === null) return null;


  return (
    <>
            <AutoMarkPage token={token} ></AutoMarkPage>
    </>
  );
}
