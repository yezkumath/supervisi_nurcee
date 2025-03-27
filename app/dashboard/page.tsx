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
import { MasterInstalasiRuang, Collaborator } from "@/app/api/interface"
import { GET_master_instalasi_ruang, GET_Supervisi_Anggota, POST_SUPERVISI } from "@/app/api/database"
import { useState, useEffect } from "react"

import { useRouter } from "next/navigation";
import { X, Plus, Save } from "lucide-react";



export default function Page() {
    const router = useRouter();
    const [dataRuang, setDataRuang] = useState<MasterInstalasiRuang[]>([]);
    const [dataColaborator, setDataColaborator] = useState<Collaborator[]>([]);
    const [ruang, setRuang] = useState<string>("");
    const [colaborator, setColaborator] = useState<string>("");
    const [nama, setNama] = useState("");
    const [jumlahPasient, setJumlahPasient] = useState("");
    const [jumlahPerawat, setJumlahPerawat] = useState("");
    const [input, setInput] = useState("");
    const [category, setCategory] = useState("");
    const [isCatComplain, setIsCatComplain] = useState(false);
    const [isCatFasilitas, setIsCatFasilitas] = useState(false);
    const [isCatJKN7, setIsCatJKN7] = useState(false);

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
                const ruang = await GET_master_instalasi_ruang();
                const anggota = await GET_Supervisi_Anggota();
                if (ruang) {
                    setDataRuang(ruang);
                    //  console.log(ruang);
                } else {
                    setDataRuang([]);
                }
                if (anggota) {
                    setDataColaborator(anggota);
                    //  console.log(anggota);
                } else {
                    setDataColaborator([]);
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
                setNama(getData.userData.nama);
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
                    setNama(formData.nama);
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
    useEffect(() => {
        // Check if ruang value is 'UNIT KERJA LAIN'
        if (ruang === 'UNIT KERJA LAIN') {
            // Add prefix only if it doesn't already exist
            if (!input.startsWith('Supervisi di ruangan ')) {
                setInput('Supervisi di ruangan ' + input);
            }

        }
        else {
            if (input.startsWith('Supervisi di ruangan ')) {
                setInput('');
            }
        }
    }, [ruang]);



    const updateAutosave = (ques: { text: string; cat: string }[]) => {
        // console.log("updateAutosave", ques);
        const formData = { nama, colaborator, ruang, jumlahPasient, jumlahPerawat, questions: ques };
        localStorage.setItem("autosaveSupervisi", JSON.stringify({ formData }));
    };

    const handleDeleteQuestion = (index: number) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
        updateAutosave(newQuestions);
    };

    const handleAddQuestion = () => {
        if (input.trim() === "") {
            toast.error("Anda belum menulis catatan!!");
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
        setIsCatJKN7(false);
    };

    const handleFasilitasClick = () => {
        setIsCatFasilitas((prev) => !prev);
        setCategory((prev) => (prev === "Fasilitas" ? "" : "Fasilitas"));
        setIsCatComplain(false);
        setIsCatJKN7(false);
    };

    const handleJKN7Click = () => {
        setIsCatJKN7((prev) => !prev);
        setCategory((prev) => (prev === "JKN7+" ? "" : "JKN7+"));
        setIsCatComplain(false);
        setIsCatFasilitas(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;

        // If ruang is 'UNIT KERJA LAIN' and user deletes the prefix, restore it
        if (ruang === 'UNIT KERJA LAIN') {
            const prefix = 'Supervisi di ruangan ';

            // If the user is trying to delete the prefix, allow them to edit after the prefix
            if (newValue.length < input.length && input.startsWith(prefix)) {
                if (newValue.startsWith(prefix)) {
                    // User deleted something after the prefix
                    setInput(newValue);
                } else {
                    // User tried to delete part of the prefix - keep the prefix intact
                    // and let them edit only what comes after
                    const userContent = input.substring(prefix.length);

                    // Calculate how much of the user content to keep based on cursor position and deletion
                    const keepLength = userContent.length - (input.length - newValue.length);
                    const newContent = userContent.substring(0, keepLength);

                    setInput(prefix + newContent);
                }
            } else {
                // Normal typing - if it already has the prefix, just update
                // Otherwise add the prefix
                if (newValue.startsWith(prefix)) {
                    setInput(newValue);
                } else {
                    setInput(prefix + newValue.replace(prefix, ''));
                }
            }
        } else {
            // Normal behavior for other ruang values
            setInput(newValue);
        }
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
                const { nama, colaborator, jumlahPasient, jumlahPerawat, ruang, questions } = getSaveData.formData;

                const _jumlahPasient = "Jumlah Pasient " + jumlahPasient;
                const _jumlahPerawat = "Jumlah Perawat " + jumlahPerawat;

                // Post the main data first
                const saveDataPromise = async () => {
                    await POST_SUPERVISI(_jumlahPasient, nama, colaborator, ruang, "Jumlah Pasient");
                    await POST_SUPERVISI(_jumlahPerawat, nama, colaborator, ruang, "Jumlah Perawat");
                    for (let i = 0; i < questions.length; i++) {
                        const _supervisi = questions[i]; // Correct reference
                        await POST_SUPERVISI(_supervisi.text, nama, colaborator, ruang, _supervisi.cat);
                    }
                    localStorage.removeItem("autosaveSupervisi");
                    setRuang("");
                    setJumlahPasient("");
                    setQuestions([]);
                    setColaborator("");
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
        <div className="flex flex-col h-[98vh] w-screen bg-gray-50 p-2 md:p-4">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
            <Toaster position="top-center" />

            {/* Header */}
            <div className="flex items-center justify-between bg-blue-500 rounded-lg px-3 py-1 mb-4 shadow-md">
                <SidebarTrigger className="text-white" />
                <h1 className="text-center font-bold text-white text-xl md:text-2xl flex-grow">
                    HALAMAN SUPERVISI
                </h1>
            </div>

            {/* Main Content Container */}
            <div className="flex flex-col gap-2">
                {/* First Section - Petugas & Rekan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-2 rounded-lg shadow-sm">
                    <div className="space-y-1">
                        <Input
                            className="border-blue-500 focus:ring-2 focus:ring-blue-300"
                            value={nama}
                            disabled
                        />
                    </div>
                    <div className="space-y-1">
                        <Select
                            value={colaborator}
                            onValueChange={(value) => {
                                setColaborator(value);
                            }}
                        >
                            <SelectTrigger className="border-blue-500 focus:ring-2 focus:ring-blue-300">
                                <SelectValue placeholder="Pilih Kolaborator" />
                            </SelectTrigger>
                            <SelectContent>
                                {dataColaborator.map((colaborator, index) => (
                                    <SelectItem key={index} value={colaborator.description}>
                                        {index + 1}. {colaborator.description}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Second Section - Room Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-2 rounded-lg shadow-sm">
                    <div className="space-y-1">
                        <label className="font-medium text-sm text-gray-700">Ruangan Instalasi</label>
                        <Select
                            value={ruang}
                            onValueChange={(value) => {
                                setRuang(value);
                            }}
                        >
                            <SelectTrigger className="border-blue-500 focus:ring-2 focus:ring-blue-300">
                                <SelectValue placeholder="Pilih ruangan" />
                            </SelectTrigger>
                            <SelectContent>
                                {dataRuang.map((ruang) => (
                                    <SelectItem key={ruang.id_ruang} value={ruang.nama_ruangan}>
                                        {ruang.nama_ruangan} - {ruang.instalasi}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <label className="font-medium text-sm text-gray-700">Jumlah Pasien Hari ini</label>
                        <Input
                            type="number"
                            placeholder="0"
                            className="border-blue-500 focus:ring-2 focus:ring-blue-300"
                            value={jumlahPasient}
                            onChange={(e) => {
                                setJumlahPasient(e.target.value);
                            }}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="font-medium text-sm text-gray-700">Jumlah Perawat Bertugas</label>
                        <Input
                            type="number"
                            placeholder="0"
                            className="border-blue-500 focus:ring-2 focus:ring-blue-300"
                            value={jumlahPerawat}
                            onChange={(e) => {
                                setJumlahPerawat(e.target.value);
                            }}
                        />
                    </div>
                </div>

                {/* Input Section */}
                <div className="bg-white p-2 rounded-lg shadow-sm">
                    <h2 className="text-xl font-bold text-amber-500 text-center">KEJADIAN DI RUANGAN HARI INI</h2>
                    <p className="text-xs text-gray-500 mb-2">*Kejadian dipisah berdasarkan poin masalahnya</p>

                    {/* Category Buttons */}
                    <div className="flex flex-wrap gap-2 mb-2">
                        <Button
                            className={`px-3 py-1 h-auto ${isCatComplain ? "bg-red-500" : "bg-red-400 hover:bg-red-500"}`}
                            onClick={handleComplainClick}
                        >
                            Complain
                        </Button>
                        <Button
                            className={`px-3 py-1 h-auto ${isCatFasilitas ? "bg-blue-500" : "bg-blue-400 hover:bg-blue-500"}`}
                            onClick={handleFasilitasClick}
                        >
                            Fasilitas
                        </Button>
                        <Button
                            className={`px-3 py-1 h-auto ${isCatJKN7 ? "bg-green-500" : "bg-green-400 hover:bg-green-500"}`}
                            onClick={handleJKN7Click}
                        >
                            JKN ≥ 6 Hari
                        </Button>
                    </div>

                    {/* Input Area */}
                    <div className="flex gap-2 items-center">
                        <div className="relative w-full">
                            <Textarea
                                className={`border-2 min-h-8 resize-y w-full border-l-8 transition-colors ${isCatComplain ? "border-l-red-400 focus:border-l-red-500" :
                                    isCatFasilitas ? "border-l-blue-400 focus:border-l-blue-500" :
                                        isCatJKN7 ? "border-l-green-400 focus:border-l-green-500" :
                                            "border-l-gray-300"
                                    } ${ruang === 'UNIT KERJA LAIN' && input.startsWith('Supervisi di ruangan ') ? "pt-8" : ""}`
                                }
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Tuliskan kejadian disini..."
                            />
                            {/* Overlay the styled prefix if condition is met */}
                            {ruang === 'UNIT KERJA LAIN' && input.startsWith('Supervisi di ruangan ') && (
                                <div className="absolute top-0 left-0 p-2 pointer-events-none">
                                    <span className="font-bold text-red-600 pl-2">TULISKAN NAMA RUANGAN</span>
                                </div>
                            )}

                        </div>
                        <Button
                            className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 h-10"
                            onClick={handleAddQuestion}
                        >
                            <Plus className="h-5 w-5 mr-1" /> Add
                        </Button>
                    </div>
                </div>

                {/* Table of Records */}
                <div className="bg-white rounded-lg shadow-sm p-2 flex-grow overflow-hidden flex flex-col">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">No.</TableHead>
                                    <TableHead>CASE</TableHead>
                                    <TableHead className="w-20 text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentQuestions.length > 0 ? (
                                    currentQuestions.map((q, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="align-top py-3">
                                                {indexOfFirstRow + index + 1}.
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <div
                                                    className={`p-3 w-full border rounded-lg ${q.cat === "Complain" ? "border-l-8 border-l-red-400 bg-red-50" :
                                                        q.cat === "Fasilitas" ? "border-l-8 border-l-blue-400 bg-blue-50" :
                                                            q.cat === "JKN7+" ? "border-l-8 border-l-green-400 bg-green-50" :
                                                                "border-gray-200"
                                                        }`}
                                                >
                                                    {q.text}
                                                </div>
                                            </TableCell>
                                            <TableCell className="align-top py-3">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="float-right"
                                                    onClick={() => handleDeleteQuestion(indexOfFirstRow + index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                                            Belum ada data yang diinput
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>

                                    {/* Responsive pagination display */}
                                    {[...Array(totalPages)].map((_, page) => {
                                        // Show first page, last page, and pages around current page
                                        const pageNum = page + 1;
                                        if (
                                            pageNum === 1 ||
                                            pageNum === totalPages ||
                                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                        ) {
                                            return (
                                                <PaginationItem key={page}>
                                                    <PaginationLink
                                                        onClick={() => setCurrentPage(pageNum)}
                                                        isActive={currentPage === pageNum}
                                                    >
                                                        {pageNum}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        } else if (
                                            (pageNum === currentPage - 2 && currentPage > 3) ||
                                            (pageNum === currentPage + 2 && currentPage < totalPages - 2)
                                        ) {
                                            return (
                                                <PaginationItem key={page}>
                                                    <span className="px-2">...</span>
                                                </PaginationItem>
                                            );
                                        }
                                        return null;
                                    })}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                    <Button
                        className="bg-green-500 hover:bg-green-600 flex items-center"
                        onClick={handleSubmit}
                    >
                        <Save className="h-5 w-5 mr-2" /> SAVE
                    </Button>

                    {/* Rows Per Page Selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 whitespace-nowrap">Baris per halaman:</span>
                        <Select
                            value={rowsPerPage.toString()}
                            onValueChange={(value) => {
                                setRowsPerPage(Number(value));
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="w-16 h-9 border-blue-500">
                                <SelectValue placeholder="Rows" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="15">15</SelectItem>
                                <SelectItem value="45">45</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}

