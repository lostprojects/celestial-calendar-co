import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileType, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

const EphemerisUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
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

  const processFiles = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const { data, error: functionError } = await supabase.functions.invoke(
          'process-ephemeris',
          {
            body: formData,
          }
        );

        if (functionError) {
          throw new Error(functionError.message || 'Failed to process file');
        }

        toast({
          title: "Success",
          description: `Processed ${data.rowsProcessed} rows from ${file.name}`,
        });
      }

      // Clear files after successful processing
      setFiles([]);
    } catch (err) {
      console.error('Error processing files:', err);
      setError(err.message || 'Failed to process files');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process files. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

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
            onClick={processFiles}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Process Files'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EphemerisUpload;