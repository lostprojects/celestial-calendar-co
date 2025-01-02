import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileType, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const EphemerisUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    onDrop: (acceptedFiles) => {
      setError(null);
      setFiles(acceptedFiles);
      toast({
        title: "Files added",
        description: `${acceptedFiles.length} file(s) ready for upload`,
      });
    },
    onDropRejected: () => {
      setError("Please upload PDF files only");
    }
  });

  return (
    <div className="container py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Ephemeris Data Upload</h1>
        <p className="text-muted-foreground">
          Upload PDF files containing ephemeris data to populate the database.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'}
          hover:border-primary hover:bg-primary/5
          transition-colors cursor-pointer
          flex flex-col items-center justify-center gap-4
        `}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <p className="text-lg font-medium">
            {isDragActive ? 'Drop the files here' : 'Drag & drop PDF files here'}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to select files
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Selected Files</h2>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center gap-2 p-2 rounded bg-muted"
              >
                <FileType className="h-4 w-4" />
                <span>{file.name}</span>
                <span className="text-sm text-muted-foreground">
                  ({Math.round(file.size / 1024)} KB)
                </span>
              </li>
            ))}
          </ul>
          <Button
            onClick={() => {
              // This will be implemented in the next step
              toast({
                title: "Coming soon",
                description: "File processing will be implemented in the next step",
              });
            }}
          >
            Process Files
          </Button>
        </div>
      )}
    </div>
  );
};

export default EphemerisUpload;