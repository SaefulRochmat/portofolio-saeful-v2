"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { signout } from "@/lib/auth-actions";

const LoginButton = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);
  if (user) {
    return (
      <Button
        onClick={() => {
          signout();
          setUser(null);
        }}
        variant="link"
        size="sm"
        className="w-full transition duration-300 ease-in-out hover:bg-red-500 hover:text-white hover:-translate-y-[3px]"
      >
        LogOut
      </Button>
    );
  }
  return (
    <Button
      variant="link"
        size="sm"
        className="w-38 text-lg transition duration-300 ease-in-out hover:bg-green-500 hover:text-dark hover:-translate-y-[3px]"
      onClick={() => {
        router.push("/login");
      }}
    >
      Login
    </Button>
  );
};

export default LoginButton;