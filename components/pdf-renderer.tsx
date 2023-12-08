"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, Loader, RotateCw, Search } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useResizeDetector } from "react-resize-detector";
import SimpleBar from "simplebar-react";
import { toast } from "sonner";
import { z } from "zod";
import PdfFullScreen from "./pdf-full-screen";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfRendererProps {
  url: string;
}

const PdfRenderer = ({ url }: PdfRendererProps) => {
  const { width, ref } = useResizeDetector();
  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const isLoading = renderedScale !== scale;

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  });

  type TCustomPageVaildator = z.infer<typeof CustomPageValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageVaildator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  });

  const handlePageSubmit = ({ page }: TCustomPageVaildator) => {
    setCurrentPage(Number(page));
    setValue("page", String(page));
  };

  return (
    <div className="w-full bg-white rounded-md shadow flex-col overflow-hidden flex items-center">
      <div className="h-14 w-full border-b border-zinc-200 overflow-hidden flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            disabled={currentPage <= 1}
            onClick={() => {
              setCurrentPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
              setValue("page", String(currentPage - 1));
            }}
            size="icon"
            variant="ghost"
            aria-label="Previous page"
          >
            <ChevronDown className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-1.5">
            <Input
              {...register("page")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
              className={cn(
                "w-12 h-8",
                errors.page && "focus-visible:ring-red-600"
              )}
            />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{numPages ?? "*"}</span>
            </p>
          </div>
          <Button
            disabled={numPages === undefined || currentPage === numPages}
            onClick={() => {
              setCurrentPage((prev) =>
                prev + 1 > numPages! ? numPages! : prev + 1
              );
              setValue("page", String(currentPage + 1));
            }}
            size="icon"
            variant="ghost"
            aria-label="Next page"
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
        </div>
        <div className="space-x-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                aria-label="zoom"
                className="focus:outline-none focus-visible:ring-transparent"
              >
                <Search className="h-5 w-5 mr-2" />
                {scale * 100}%<ChevronDown className="h-5 w-5 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Zoom Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(3)}>
                300%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => setRotation((prev) => prev + 90)}
            aria-label="rotate"
            size="icon"
            variant="ghost"
          >
            <RotateCw className="h-5 w-5" />
          </Button>

          <PdfFullScreen fileURL={url} />
        </div>
      </div>
      <div className="flex-1 w-full px-6 max-h-[31rem] overflow-auto">
        <SimpleBar autoHide={false} className="max-h-[clac(100vh-10rem)]">
          <div ref={ref} className="overflow-auto">
            <Document
              loading={
                <div className="flex items-center justify-center">
                  <Loader className="h-6 w-6 animate-spin my-24" />
                </div>
              }
              onLoadError={() => {
                toast.error("PDF load fail, Please try again later");
              }}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              file={url}
              className="max-h-full"
            >
              {isLoading && renderedScale ? (
                <Page
                  pageNumber={currentPage}
                  width={width ? width : 0}
                  scale={scale}
                  rotate={rotation}
                  key={"@" + renderedScale}
                />
              ) : null}

              <Page
                className={cn(isLoading ? "hidden" : "")}
                pageNumber={currentPage}
                width={width ? width : 0}
                scale={scale}
                rotate={rotation}
                key={"@" + scale}
                loading={
                  <div className="flex items-center justify-center">
                    <Loader className="h-6 w-6 animate-spin my-24" />
                  </div>
                }
                onRenderSuccess={() => setRenderedScale(scale)}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PdfRenderer;
