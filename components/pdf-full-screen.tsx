import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { Expand, Loader } from "lucide-react";
import { useState,useEffect } from "react";
import { Document, Page } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import SimpleBar from "simplebar-react";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface PdfFullScreenProps {
  fileURL: string;
}

const PdfFullScreen = ({ fileURL }: PdfFullScreenProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { width, ref } = useResizeDetector();
  const [numPages, setNumPages] = useState<number>();

  useEffect(() => {
    const onKeyDown = (event: any) => {
      if (event.key === "F11") {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [setIsOpen]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(vi) => {
        if (!vi) {
          setIsOpen(vi);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button 
        onClick={() => setIsOpen(true)}
        variant="ghost" 
        size="icon"
        >
          <Expand className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl md:w-full h-[40rem]">
        <SimpleBar>
          <div ref={ref} className="overflow-auto">
            <Document
              loading={
                <>
                  <div className="flex items-center justify-center">
                    <Loader className="h-6 w-6 animate-spin my-24" />
                  </div>
                </>
              }
              onLoadError={() => {
                toast.error("PDF load fail, Please try again later");
              }}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              file={fileURL}
              className="max-h-screen"
            >
              {new Array(numPages).fill(0).map((_, i) => (
                <Page pageNumber={i + 1} width={width ? width : 1} key={i} />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullScreen;
