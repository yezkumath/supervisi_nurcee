'use client';
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import toast, { Toaster } from 'react-hot-toast';
import { MasterInstalasiRuang } from "@/app/interface"
import { GET_master_instalasi_ruang, POST_SUPERVISI } from "@/app/api/database"
import { useState, useEffect } from "react"

import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const [dataRuang, setDataRuang] = useState<MasterInstalasiRuang[]>([]);
    const [ruang, setRuang] = useState<string>("");
    const [nip, setNIP] = useState("");
    const [jumlahPasient, setJumlahPasient] = useState("");
    const [jumlahPerawat, setJumlahPerawat] = useState("");
    const [input, setInput] = useState("");
    const [category, setCategory] = useState("");
    const [isCatComplain, setIsCatComplain] = useState(false);
    const [isCatFasilitas, setIsCatFasilitas] = useState(false);
    const [isCatPasien4hari, setIsCatPasien4hari] = useState(false);

    const [questions, setQuestions] = useState<{ text: string, cat: string }[]>([]);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page

    // Calculate total pages
    const totalPages = Math.ceil(questions.length / rowsPerPage);

    // Get current page questions
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentQuestions = questions.slice(indexOfFirstRow, indexOfLastRow);




    //---------------------------------START---------------------------------
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await GET_master_instalasi_ruang();
                if (result) {
                    setDataRuang(result);
                    console.log(result);
                } else {
                    setDataRuang([]);
                }

            } catch (error) {
                console.error("Error:", error);
                setDataRuang([]);
            }
        };

        const getData = () => {
            const loginData = localStorage.getItem("loginData");
            if (loginData) {
                const getData = loginData ? JSON.parse(loginData) : null;
                setNIP(getData.userData.nip);
            }
            else {
                router.push("/");
            }
        };

        const savedData = localStorage.getItem("autosaveSupervisi");
        if (savedData) {
            try {
                const { formData } = JSON.parse(savedData);
                if (formData) {
                    setNIP(formData.nip);
                    setRuang(formData.ruang);
                    setJumlahPasient(formData.jumlahPasient);
                    setQuestions(formData.questions);
                }
            } catch (error) {
                console.error("Error parsing autosaved form data:", error);
            }
        }

        fetchData();
        getData();
    }, []);



    const updateAutosave = (ques: { text: string; cat: string }[]) => {
        console.log("updateAutosave", ques);
        const formData = { nip, ruang, jumlahPasient, jumlahPerawat, questions: ques };
        localStorage.setItem("autosaveSupervisi", JSON.stringify({ formData }));
    };

    const handleDeleteQuestion = (index: number) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
        updateAutosave(newQuestions);
    };


    const handleAddQuestion = () => {
        if (input.trim() === "") {
            toast.error("Please enter a question.");
            return;
        }

        const newQuestion = { text: input, cat: category };
        const updatedQuestions = [...questions, newQuestion];
        setQuestions(updatedQuestions);
        setInput("");  // Clear the input field

        // Update local storage with the new questions array
        updateAutosave(updatedQuestions);
    };

    const handleComplainClick = () => {
        setIsCatComplain((prev) => !prev);
        setCategory((prev) => (prev === "Complain" ? "" : "Complain"));
        setIsCatFasilitas(false);
        setIsCatPasien4hari(false);
    };
    const handleFasilitasClick = () => {
        setIsCatFasilitas((prev) => !prev);
        setCategory((prev) => (prev === "Fasilitas" ? "" : "Fasilitas"));
        setIsCatComplain(false);
        setIsCatPasien4hari(false);
    };
    const handlePasien4hariClick = () => {
        setIsCatPasien4hari((prev) => !prev);
        setCategory((prev) => (prev === "Pasien4hari" ? "" : "Pasien4hari"));
        setIsCatComplain(false);
        setIsCatFasilitas(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;

        setInput(newText);

    };

    const handleSubmit = async () => {
        if (ruang) {
            if (jumlahPasient && jumlahPerawat) {
                // Retrieve the data from local storage
                const save = localStorage.getItem("autosaveSupervisi");
                if (!save) {
                    toast.error("No saved data found!");
                    return;
                }

                const getSaveData = JSON.parse(save);

                // Check if formData exists in the parsed data
                if (!getSaveData || !getSaveData.formData) {
                    toast.error("No valid form data found!");
                    return;
                }

                // Destructure the required values from formData
                const { jumlahPasient, nip, ruang, questions } = getSaveData.formData;

                const _jumlahPasient = "Jumlah Pasient " + jumlahPasient;
                const _jumlahPerawat = "Jumlah Perawat " + jumlahPerawat;

                // Post the main data first
                const saveDataPromise = async () => {
                    await POST_SUPERVISI(_jumlahPasient, nip, ruang, "Jumlah Pasient");
                    await POST_SUPERVISI(_jumlahPerawat, nip, ruang, "Jumlah Perawat");
                    for (let i = 0; i < questions.length; i++) {
                        const _supervisi = questions[i]; // Correct reference
                        await POST_SUPERVISI(_supervisi.text, nip, ruang, _supervisi.cat);
                    }
                    localStorage.removeItem("autosaveSupervisi");
                    setRuang("");
                    setJumlahPasient("");
                    setQuestions([]);
                    return "Data saved successfully";
                }
                toast.promise(
                    saveDataPromise(),
                    {
                        loading: 'Proses Saving...',
                        success: 'SUCCESS SAVE',
                        error: 'Error saving data',
                    }
                );
            }
            else {
                toast.error("Jumlah Pasien dan Perawat Harus di inputkan");
            }
        } else {
            toast.error("Ruangan Harus diinputkan");
        }
    };



    //---------------------------------END---------------------------------


    return (

        <div className="space-y-3 h-[98vh] flex w-screen flex-col ">
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <Toaster position="top-center" />
            <div className="flex items-center justify-between bg-blue-500 rounded-lg ml-5 mr-5 mt-3">
                <SidebarTrigger className="ml-1 text-white" />
                <h1 className="text-center font-bold text-white text-2xl flex-grow">
                    HALAMAN SUPERVISI
                </h1>
            </div>
            <div className="flex space-x-1">

                <div className="rounded-lg flex  flex-wrap border-2 w-full ml-5 mr-5">
                    <div className="w-80 mt-2 ml-2 mr-2 mb-2">
                        <p>Pilih lokasi ruangan</p>
                        <Select
                            value={ruang}
                            onValueChange={(value) => {
                                setRuang(value);
                                console.log("Selected value:", value);
                            }}
                        >
                            <SelectTrigger className="border-blue-700 border-2 w-[315px] ">
                                <SelectValue placeholder="select" />
                            </SelectTrigger>
                            <SelectContent>
                                {dataRuang.map((ruang) => (
                                    <SelectItem key={ruang.id_ruang} value={ruang.id_ruang}>
                                        {ruang.nama_ruangan}  &nbsp;&nbsp;&nbsp; -instalasi-  &nbsp;&nbsp;&nbsp; {ruang.instalasi}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-80 mt-2 ml-2 mr-2 mb-2 ">
                        <p className="mr-2">JUMLAH PASIEN HARI INI</p>
                        <Input
                            type="number"
                            placeholder="00"
                            className="border-blue-700 border-2 w-[315px]"
                            value={jumlahPasient}
                            onChange={(e) => {
                                setJumlahPasient(e.target.value);
                            }}
                        />
                    </div>
                    <div className="w-80 mt-2 ml-2 mr-2 mb-2 ">
                        <p className="mr-2">JUMLAH PERAWAT / SDM HARI INI</p>
                        <Input
                            type="number"
                            placeholder="00"
                            className="border-blue-700 border-2 w-[315px]"
                            value={jumlahPerawat}
                            onChange={(e) => {
                                setJumlahPerawat(e.target.value);
                            }}
                        />
                    </div>
                </div>


            </div>
            <div className=" rounded-lg w-full mr-7">
                <p className="text-center font-bold text-amber-400 mt-3 text-2xl">KEJADIAN DI RUANGAN HARI INI</p>
                <p className="text-left ml-2">*Kejadian dipisah berdasarkan poin masalahnya</p>
                <div className="flex">
                    <Button className=" m-2 bg-red-400" onClick={handleComplainClick}>Complain</Button>
                    <Button className=" m-2 bg-blue-400" onClick={handleFasilitasClick} >Fasilitas</Button>
                    <Button className=" m-2 bg-green-400" onClick={handlePasien4hariClick}>Pasient &gt; 4 hari</Button>
                </div>
                <div className="flex justify-between justify-center items-center">
                    <Textarea
                        className={`border-2 ml-3 h-24 w-11/12 mb-3 border-l-8 ${isCatComplain ? "border-red-400" : ""} ${isCatFasilitas ? "border-blue-400" : ""} ${isCatPasien4hari ? "border-green-400" : ""}`}
                        value={input}
                        onChange={handleInputChange}  // Bind the input to state
                    />
                    <Button className="mr-6 ml-3" onClick={handleAddQuestion}>
                        Add
                    </Button>
                </div>


            </div>
            <div className=" h-3/5 overflow-y-auto  w-full mr-5">
                <Table >
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-5">No.</TableHead>
                            <TableHead className="text-center">CASE</TableHead>
                            <TableHead className="text-right w-5"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentQuestions.map((q, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {index + 1}.
                                </TableCell>
                                <TableCell>
                                    <textarea
                                        className={`p-2 w-full h-10 border border-l-8 rounded-lg ${q.cat === "Complain" ? "border-red-400" : ""} ${q.cat === "Fasilitas" ? "border-blue-400" : ""} ${q.cat === "Pasien4hari" ? "border-green-400" : ""}`}
                                        value={q.text}
                                        readOnly
                                        style={{ overflow: 'hidden' }} // Prevent scrollbar
                                        ref={(textarea) => {
                                            if (textarea) {
                                                // Set initial height based on scrollHeight when component mounts
                                                textarea.style.height = '40px';
                                                textarea.style.height = `${textarea.scrollHeight}px`;
                                            }
                                        }}
                                    ></textarea>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleDeleteQuestion(index)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {
                totalPages > 1 && (
                    <Pagination className="mt-4">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>

                            {[...Array(totalPages)].map((_, page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        onClick={() => setCurrentPage(page + 1)}
                                        isActive={currentPage === page + 1}
                                    >
                                        {page + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )
            }

            <div className="flex mr-5 justify-between">
                <Button className="mt-5 ml-5 mr-5 w-48" onClick={handleSubmit}>SAVE</Button>

                {/* Select Rows Per Page */}
                <div className="flex items-center space-x-2 ">
                    <p> Jumlah Maxsimal baris dalam 1 halaman</p>
                    <Select
                        value={rowsPerPage.toString()}
                        onValueChange={(value) => {
                            setRowsPerPage(Number(value));
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="w-20 border-blue-700 border-2">
                            <SelectValue placeholder="Rows" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="15">15</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

        </div >



    );
}