import React from "react";
import MaxWidthWrapper from "./max-width-wrapper";
import Link from "next/link";
import {
  LoginLink,
  RegisterLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";
import { ArrowRightCircle } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  return (
    <>
      <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
        <MaxWidthWrapper>
          <div className="flex items-center justify-between border-b border-zinc-200 h-14">
            <Link href="/" className="z-40 flex items-center">
              <Image src="/favicon.ico" alt="" width={30} height={30} />
              <span className="ml-2 font-bold">DocsChat</span>
            </Link>
            {/* moblie nav */}

            <div className="hidden items-center space-x-4 sm:flex">
              <>
                <Link href="/pricing" className="">
                  <span className="font-bold text-sm hover:text-blue-600">
                    Pricing
                  </span>
                </Link>

                {!user && (
                  <LoginLink className="font-bold text-sm hover:text-blue-600 mr-10">
                    Sign In
                  </LoginLink>
                )}
                {user ? (
                  <Link href="/dashboard">
                    <Button className="border-none rounded-none">Go to Dashbard</Button>
                  </Link>
                ) : (
                  <RegisterLink
                    href="/api/auth/login?"
                    target="_blank"
                    className="px-4 cursor-pointer flex justify-center items-center py-2 rounded-md bg-blue-600 text-white"
                  >
                    Get Started <ArrowRightCircle className="ml-2" />
                  </RegisterLink>
                )}
              </>
            </div>
          </div>
        </MaxWidthWrapper>
      </nav>
    </>
  );
};

export default Navbar;
