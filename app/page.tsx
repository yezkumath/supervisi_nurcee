'use client';
import { useState } from "react";
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


export default function Home() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page reload on form submission
    setLoading(true);
    try {
      const loginData = await POST_LOGIN(username, password);
      if (loginData.Code === 200) {
        const userData = loginData.Data;
        localStorage.setItem("loginData", JSON.stringify({ userData }));
        const detailLogin = await GET_EMPLOYEE_BY_NIP(userData.nip);
        console.log("detil", detailLogin);
        localStorage.setItem("pictureUser", detailLogin.foto_profil);
        toast.success(loginData.Message);
        window.location.href = '/dashboard';
      }
      else {
        toast.error(loginData.Message);
        setPassword("");
      }

    }
    catch (error) {
      console.error("Error:", error);
    }
  }
  return (
    <div style={{ backgroundImage: "url('/images/bg_login-singup.png')", backgroundSize: "cover" }} className={`h-screen w-screen flex ${loading ? "cursor-wait" : ""}`}>
      <Toaster position="top-center" />
      <div className="w-1/2">
        <div className="mt-32 ml-16">
          <Image src="/images/logo-long.png" alt="logo" width={900} height={0} />
          <p className="mt-9 text-4xl font-bold">SELAMAT DATANG</p>
          <p className="text-2xl font-bold text-orange-400">Sistem Informasi Supervisi Keperawatan <br />RS. Elisabeth Semarang</p>
          <p className="mt-52 text-xl font-bold italic text-slate-500">&quot;Pancaran Cintanya<br />Menyembuhkan Derita Sesama&quot;</p>
        </div>
      </div>
      <div className="w-1/2 flex justify-center items-center">
        <Card className="w-[600px] bg-yellow-50 border-blue-300">
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
    </div >
  );
}
