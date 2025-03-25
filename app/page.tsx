'use client';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { POST_LOGIN, GET_EMPLOYEE_BY_NIP } from "@/app/api/api"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image";
import { Input } from "@/components/ui/input"
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from "next/navigation";

export default function Home() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Reset form state when component mounts
  useEffect(() => {
    const checkLoginStatus = () => {
      setUsername(""); // Reset username on mount/remount
      setPassword(""); // Reset password on mount/remount

      const loginData = localStorage.getItem("loginData");
      if (loginData) {
        router.push("/dashboard");
      }
    };

    checkLoginStatus();

    // Add event listener for when user navigates back to this page
    window.addEventListener('focus', checkLoginStatus);

    return () => {
      window.removeEventListener('focus', checkLoginStatus);
    };
  }, [router]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page reload on form submission
    setLoading(true);

    const loginPromise = new Promise(async (resolve, reject) => {
      try {
        const loginData = await POST_LOGIN(username, password);
        // console.log("logindata", loginData);
        if (loginData.Code === 200) {
          const userData = loginData.Data;
          localStorage.setItem("loginData", JSON.stringify({ userData }));
          const detailLogin = await GET_EMPLOYEE_BY_NIP(userData.nip);
          // console.log("detil", detailLogin);
          localStorage.setItem("pictureUser", detailLogin.foto_profil);
          resolve(loginData.Message);
          window.location.href = '/dashboard';
        }
        else {
          setPassword("");
          reject(loginData.Message);
        }
      }
      catch (error) {
        console.error("Error:", error);
        reject("Terjadi kesalahan saat login");
      } finally {
        setLoading(false);
      }
    });

    toast.promise(loginPromise, {
      loading: 'Sedang memproses login...',
      success: (message: string) => `${message}`,
      error: (message: string) => `${message}`
    });
  }


  return (
    <div style=
      {{
        backgroundImage: "url('/images/bg_login-singup.png')",
        backgroundSize: "cover",
        backgroundPosition: "58% 100%",
        backgroundRepeat: "no-repeat"
      }}
      className={`h-screen w-screen flex flex-col  ${loading ? "cursor-wait" : ""}`}>
      <Toaster position="top-center" />
      <div className="flex flex-wrap justify-center md:mt-10 mt-5">
        <div className="md:w-4/12 m-6">
          <Image src="/images/logo-long.png" alt="logo" width={900} height={0} />
        </div>
        <div className="md:w-6/12"></div>
        <div className="ml-4">
          <p className="md:mt-9 md:text-4xl text-2xl font-bold">SELAMAT DATANG</p>
          <p className="md:text-2xl font-bold text-orange-400">Sistem Informasi Supervisi Keperawatan <br />RS. Elisabeth Semarang</p>
          <p className="mt-10 md:text-xl  font-bold italic text-slate-500">&quot;Pancaran Cintanya<br />Menyembuhkan Derita Sesama&quot;</p>
        </div>
        <div className="md:ml-40 md:mt-0 mt-10">
          <Card className="md:w-[600px] w-80 bg-yellow-50 border-blue-300">
            <CardHeader>
              <CardTitle className="text-2xl">
                Supervisi Keperawatan
              </CardTitle>
              <CardDescription className="text-sky-600 font-bold text-3xl">
                SSO Log-in
              </CardDescription >
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Masukkan Nomor Induk Pegawai</p>
              <Input placeholder="NIP"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white"
                autoFocus
              />
              <p>Masukkan Password</p>
              <Input placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white"
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full"
                onClick={handleSubmit}
              >Masuk</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div >
  );
}
