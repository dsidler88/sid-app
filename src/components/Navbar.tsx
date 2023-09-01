import { NavLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import AuthProviders from "./AuthProviders";
import { getCurrentUser } from "@/lib/auth";
import { SessionInterface } from "../../common.types";
import { signOut } from "next-auth/react";
import ProfileControls from "./ProfileControls";

const dummySession: SessionInterface = {
  user: {
    id: "123",
    name: "dan",
    email: "test@test.com",
    avatarUrl: "https://avatars.githubusercontent.com/u/61506681?v=4",
    image: "https://avatars.githubusercontent.com/u/61506681?v=4",
  },
  expires: "2024-01-01T00:00:00.000Z",
};

//remember async only works because it's server component
const Navbar = async () => {
  //actually get the session data.
  const session = await getCurrentUser();
  //const session = dummySession;

  return (
    <nav className="flex justify-between items-center py-5 px-8 border-b border-nav-border gap-4">
      <div className="flex-1 flexStart gap-10">
        <Link href="/">
          <Image src="/logo.svg" width={115} height={43} alt="sid" />
        </Link>
        <ul className="xl:flex hidden text-sm gap-7">
          {NavLinks.map((link) => (
            <Link href={link.href} key={link.text}>
              {link.text}
            </Link>
          ))}
        </ul>
      </div>
      <div className="flexCenter gap-4">
        {/* button to sign in */}
        {session?.user ? (
          <>
            <ProfileControls session={session} />
            <Link href="/create-project">Share Work</Link>
            {/* <button type="button" className="text-sm" onClick={signOut}>
              Sign Out
            </button> */}
          </>
        ) : (
          <AuthProviders />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
