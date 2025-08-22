import {
  getMediaImageApi,
  getMediaVideoApi,
  uploadArrayFileApi,
  uploadSingleFileApi,
} from "@/features/upload/apis/uploadApi";
import UploadImageComponent from "@/shared/components/form/upload-image-component";
import { Button } from "@/shared/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const UploadPage = () => {
  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [arrayFile, setArrayFile] = useState<File[] | null>(null);

  const getMediaResult = useQuery({
    queryKey: ["upload"],
    queryFn: async () => {
      const imageResult = await getMediaImageApi();
      const videoResult = await getMediaVideoApi();

      return { image: imageResult.data, video: videoResult.data };
    },
  });

  const submitSingleFileResult = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      if (singleFile) formData.append("singleFile", singleFile);
      return await uploadSingleFileApi(formData);
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const submitArrayFileResult = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      if (arrayFile) {
        arrayFile.forEach((file) => formData.append("arrayFile", file));
      }
      return await uploadArrayFileApi(formData);
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="space-y-10">
      {/* top */}
      <div>
        <h1 className="text-2xl font-bold">Upload Page</h1>
        <p className="text-gray-500">
          Upload single or multiple files using the form below.
        </p>
      </div>
      {/* view */}
      <div>
        {getMediaResult.isLoading && <div>Loading...</div>}
        <ul className="flex flex-wrap  gap-x-4 gap-y-2">
          {getMediaResult.data?.image.map((media, idx) => (
            <li
              key={idx}
              style={{
                maxWidth: 160,
                width: media.width,
              }}
            >
              <img src={media.url} alt={`img-${idx}`} />
            </li>
          ))}
          {getMediaResult.data?.video.map((media, idx) => (
            <li
              key={idx}
              style={{
                maxWidth: 160,
                width: media.width,
              }}
            >
              <video src={media.url} controls />
            </li>
          ))}
        </ul>
      </div>
      {/* single */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitSingleFileResult.mutate();
        }}
        className="space-y-4 border-t pt-4"
      >
        <label htmlFor="">Single File</label>
        <UploadImageComponent
          onChangeFile={(e) => setSingleFile(e[0])}
          accept="image/*, video/*"
          disabled={submitSingleFileResult.isPending}
        />

        <Button disabled={submitSingleFileResult.isPending}>Submit</Button>
      </form>

      {/* array */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitArrayFileResult.mutate();
        }}
        className="space-y-4 border-t pt-4"
      >
        <label htmlFor="">Array File</label>
        <UploadImageComponent
          previewType="image"
          multiple
          onChangeFile={(e) => setArrayFile(e)}
          accept="image/*, video/*"
          disabled={submitArrayFileResult.isPending}
        />

        <Button disabled={submitArrayFileResult.isPending}> Submit</Button>
      </form>
    </div>
  );
};

export default UploadPage;
