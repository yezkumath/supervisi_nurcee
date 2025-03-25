'use client';
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useEffect, useState } from "react";


export default function Layout({ children }: { children: React.ReactNode }) {

    const [userData, setUserData] = useState<{ nip: string, nama: string }>({ nip: "", nama: "" });
    const [profilePicture, setProfilePicture] = useState<string>("");

    useEffect(() => {
        const loginData = localStorage.getItem("loginData");
        if (!loginData) {
            window.location.href = '/';
            return;
        }
        const getData = () => {

            const getData = loginData ? JSON.parse(loginData) : null;
            //  console.log("getData", getData);
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