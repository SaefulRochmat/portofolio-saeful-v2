"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";

const UserGreetText = () => {
  const [user, setUser] = useState<any>(null);
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

  return (
    <div className="flex items-center gap-1">
      {user ? (
        <>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Hello,
          </span>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {user.user_metadata.full_name ?? "Admin"}
          </span>
        </>
      ) : (
        <>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Hello,
          </span>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            Guest
          </span>
        </>
      )}
    </div>
  );
};

export default UserGreetText;
