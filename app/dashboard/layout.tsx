'use client';
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [userData, setUserData] = useState<{ nip: string, nama: string }>({ nip: "", nama: "" });
    const [profilePicture, setProfilePicture] = useState<string>("");

    useEffect(() => {
        const loginData = localStorage.getItem("loginData");
        if (!loginData) {
            router.push("/");
            return;
        }
        const getData = () => {

            const getData = loginData ? JSON.parse(loginData) : null;
            console.log("getData", getData);
            setUserData(getData.userData)
        };
        const pictureData = () => {
            const picture = localStorage.getItem("pictureUser");
            setProfilePicture(`data:image/jpeg;base64,${picture}`);
        }
        getData();
        pictureData();
    }, []);

    return (
        <div>
            <SidebarProvider>
                <AppSidebar user={{
                    nip: userData?.nip,
                    nama: userData?.nama,
                    avatar: profilePicture
                }} />

                {children}
            </SidebarProvider>
        </div>

    );
}