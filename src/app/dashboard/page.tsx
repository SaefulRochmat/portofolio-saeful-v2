// src/app/dashboard/page.tsx
import LoginButton from "@/components/LoginLogoutButton";
import UserGreetText from "@/components/UserGreetText";

export default function Dashboard () {
 
    return (
        <>
            <h1> Halaman Dashboard</h1>
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
                <UserGreetText />
                <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-linear-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
                <LoginButton />
                </div>
            </div>
        </>
    );
}