"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import UploadButton from "@/components/upload-button";
import { format } from "date-fns";
import {
  ExternalLink,
  Loader2,
  PenSquare,
  RefreshCcwIcon,
  Trash
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const Dashboard = () => {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] =
    useState<String | null>(null);

  const utils = trpc.useContext();

  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  const { mutate: deleteUserFile } = trpc.deleteUserFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
    onMutate({ id }) {
      setCurrentlyDeletingFile(id);
    },
    onSettled() {
      setCurrentlyDeletingFile(null);
    },
  });

  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div className="mt-7 flex flex-col items-start justify-between gap-4 border-b border-gray-300 pb-5 sm:flex-row sm:items-center mx-10 sm:gap-0">
        <h2 className="mb-4 font-semibold text-4xl text-gray-800">My Files</h2>
        <UploadButton />
      </div>

      {files && files.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow hover:shadow-lg transition"
              >
                <Link
                  href={`/dashboard/${file.id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="pt-6 px-6 flex justify-between space-x-6 w-full">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium truncate flex gap-52 text-zinc-800 text-lg">
                          {file.name}{" "}
                          <ExternalLink className="h-5 w-5 text-zinc-500 hover:scale-110" />
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="px-6 flex mt-6 grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <PenSquare className="h-6 w-6" />
                    {format(new Date(file.createdAt), "dd MMM yyyy ")}
                  </div>
                  <div className="flex items-center gap-2 mx-6">
                    <RefreshCcwIcon className="h-4 w-4" />
                    {file.uploadStatus}
                  </div>
                  <Button
                    onClick={() => deleteUserFile({ id: file.id })}
                    variant={"destructive"}
                    className="w-full"
                  >
                    {currentlyDeletingFile === file.id ? (
                      toast.success("File Deleted"),
                      <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (     
        <>
        <div className="md:flex lg:flex items-center">
          <div className="flex items-center mt-4 md:ml-8 ml-9 lg:ml-8 space-x-4">
            <Skeleton className="h-12 bg-slate-300 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 bg-slate-300 w-[250px]" />
              <Skeleton className="h-4 bg-slate-300 w-[200px]" />
            </div>
          </div>
          <div className="flex items-center mt-4 mx-10 space-x-4">
            <Skeleton className="h-12 bg-slate-300 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 bg-slate-300 w-[250px]" />
              <Skeleton className="h-4 bg-slate-300 w-[200px]" />
            </div>
          </div>
          <div className="flex items-center mt-4 mx-10 space-x-4">
            <Skeleton className="h-12 bg-slate-300 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 bg-slate-300 w-[250px]" />
              <Skeleton className="h-4 bg-slate-300 w-[200px]" />
            </div>
          </div>
        </div>
        </>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Image
            src="/empty_folder_illustration.svg"
            alt=""
            width={250}
            height={250}
          />
          <h3 className="font-bold text-xl">Files is Empty</h3>
          <p className="font-semibold text-sm">
            Let&apos;s go upload your first PDF
          </p>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
