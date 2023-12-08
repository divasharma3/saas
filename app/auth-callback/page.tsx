"use client";
import React, { useState } from "react";
import { trpc } from "../_trpc/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      if (success) {
        router.push(origin ? `/${origin}` : "/dashboard");
      }
    },
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        router.push("/sign-in");
      }
    },
    retry: true,
    retryDelay: 500,
  });

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader className="h-8 w-8 animate-spin text-zinc-800" />
        <h2 className="font-bold text-xl">
          Please Wait Setting up your account
        </h2>
        <p className="font-semibold text-sm">
          You will be redirected to dashboard automatically.
        </p>
      </div>
    </div>
  );
}
