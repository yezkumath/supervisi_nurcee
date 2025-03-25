'use client';
import * as XLSX from 'xlsx';
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { ListDataSupervisi, DetailSupervisi } from "@/app/api/interface";
import { GET_list_supervisi, GET_detail_list_supervisi } from "@/app/api/database";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"

export default function Page() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    const [listData, setListData] = useState<ListDataSupervisi[]>([]);
    const [detailList, setDetailList] = useState<DetailSupervisi[]>([]);
    const [isClicked, setIsClicked] = useState<number | null>(null);
    const [isLoadingList, setIsLoadingList] = useState<boolean>(false);
    const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
    const [open, setOpen] = useState(false);


    const [selectedCategory, setSelectedCategory] = useState("");

    // New state for search term (to filter by detail.note)
    const [searchTerm, setSearchTerm] = useState("");

    // Filter the detailList by searchTerm (case-insensitive)
    const filteredDetailList = detailList.filter((detail) =>
        detail.note.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page

    // Calculate total pages
    const totalPages = Math.ceil(detailList.length / rowsPerPage);

    // Get current page questions
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentDetailList = filteredDetailList.slice(indexOfFirstRow, indexOfLastRow);

    // Filter the list based on the selected category
    const filteredList = selectedCategory === "All" || selectedCategory === ""
        ? currentDetailList // Show all if "All" is selected or no category is selected
        : currentDetailList.filter((detail) => detail.category === selectedCategory);



    useEffect(() => {
        if (date) {
            // Reset list data and set loading state
            setListData([]);
            setIsLoadingList(true);
            const formattedDate = date.toLocaleDateString('en-CA');
            console.log("date:", formattedDate);
            const fetchListData = async () => {
                try {
                    const result = await GET_list_supervisi(formattedDate);
                    if (result) {
                        console.log(result);
                        setListData(result);
                        setIsClicked(null);
                    } else {
                        console.error("Error: No result returned");
                        setListData([]); // No data found
                    }
                } catch (error) {
                    console.error("Error:", error);
                    setListData([]);
                } finally {
                    setIsLoadingList(false);
                }
            };
            fetchListData();
        }
    }, [date]);


    const handleDetilData = async (listData: ListDataSupervisi, index: number) => {
        try {
            // Reset detail list data and set loading state
            setSelectedCategory("");
            setDetailList([]);
            setIsLoadingDetail(true);
            const formattedDate = listData.tanggal.toLocaleDateString('en-CA');
            const result = await GET_detail_list_supervisi(listData.ruang, listData.supervisi, formattedDate);
            if (result) {
                setDetailList(result);
                console.log("Detail Note:", result);
                setIsClicked(index);
            } else {
                console.error("Error: No detail result returned");
                setDetailList([]);
            }
            setOpen(false)
        } catch (error) {
            console.error("Error:", error);
            setDetailList([]);
        } finally {
            setIsLoadingDetail(false);
        }
    };


    const handleDownloadExcel = async (listData: ListDataSupervisi) => {
        try {
            const formattedDate = listData.tanggal.toLocaleDateString('en-CA');

            const result = await GET_detail_list_supervisi(listData.ruang, listData.supervisi, formattedDate);

            console.log(result);
            if (result) {
                // Convert the date field for each item to the desired UTC format.
                const dataWithUTC = (result as DetailSupervisi[]).map((item: DetailSupervisi) => ({
                    ...item,
                    tanggal: new Date(item.tanggal).toLocaleString("id-ID", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                        timeZone: "UTC"
                    })
                }));

                const worksheet = XLSX.utils.json_to_sheet(dataWithUTC);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Detail Data");
                const fileName = `Supervisi Ruang ${listData.ruang} Oleh ${listData.supervisi} ${formattedDate}.xlsx`;
                XLSX.writeFile(workbook, fileName);
            } else {
                console.error("Error: No detail result returned");
            }
        } catch (error) {
            console.error("Error:", error);
            setDetailList([]);
        } finally {
            setIsLoadingDetail(false);
        }
    };

    return (
        <div className="w-screen h-screen">
            <div className="flex items-center bg-amber-400 rounded-lg ml-5 mr-5 mt-3">
                <SidebarTrigger className="ml-1 text-white" />
                <h1 className="text-center font-bold text-white text-2xl flex-grow">
                    HISTORY SUPERVISI
                </h1>
            </div>



            <div className="flex flex-wrap">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger className=" border-2 border-yellow-300 text-white bg-yellow-300 font-semibold rounded-lg ml-5 mr-5 mt-5 w-44">Pilih Tanggal</PopoverTrigger>
                    <PopoverContent className="md:w-full ld:w-full  w-[390px] m-2">
                        <div className="flex flex-wrap justify-center md:justify-normal ld:justify-normal">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                            />
                            <div className="bg-slate-200 md:w-1 ld:w-1 w-0 "></div>

                            <div className=" ml-2">
                                {isLoadingList ? (
                                    <img src="/images/loading.gif" alt="Loading..." />
                                ) : listData.length > 0 ? (
                                    <div className="h-[300px] overflow-x-auto ">
                                        <Table>
                                            <TableBody>
                                                {listData.map((list, index) => (
                                                    <TableRow key={index} className="border-b hover:bg-gray-50">
                                                        <TableCell className="text-center font-medium w-12">{index + 1}.</TableCell>
                                                        <TableCell>
                                                            {/* Ruang section - full width */}
                                                            <div className="flex items-center w-full">
                                                                <div className="w-24 font-medium text-blue-600 ">RUANG</div>
                                                                <div className="text-blue-600 font-medium flex-grow">{list.ruang}</div>
                                                            </div>

                                                            {/* Supervisi section */}
                                                            <div className="flex items-center">
                                                                <div className="w-24 font-medium ">Supervisi</div>
                                                                <div>{list.supervisi}</div>
                                                            </div>

                                                            {/* Kolaborator section */}
                                                            <div className="flex items-center">
                                                                <div className="w-24 font-medium text-gray-700 text-sm">Kolaborator</div>
                                                                <div className=' text-gray-700 text-sm'>{list.kolaborator}</div>
                                                            </div>

                                                            {/* Buttons section - full width row with buttons spread */}
                                                            <div className="flex w-full justify-between mt-2">
                                                                <Button
                                                                    onClick={() => handleDetilData(list, index)}
                                                                    className={`px-4 py-2 rounded-md transition-colors ${isClicked === index ? 'bg-slate-300' : 'bg-yellow-300 hover:bg-yellow-400'
                                                                        }`}
                                                                >
                                                                    <p className="text-xs font-bold">Open</p>
                                                                </Button>

                                                                <Button
                                                                    onClick={() => handleDownloadExcel(list)}
                                                                    className="bg-blue-300 hover:bg-blue-400 px-4 py-2 rounded-md transition-colors"
                                                                >
                                                                    <p className="text-xs font-bold">Download Excel</p>
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className='m-2'>Tidak ada data yang tersedia <br />pada tanggal yang anda pilih</div>

                                )}
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                <Input
                    className="w-96 ml-5 mr-5 mt-5"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
                <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
                    <SelectTrigger className="w-[180px] ml-5 mr-5 mt-5 border-grey-700 border-2">
                        <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup className='space-y-2'>
                            <SelectLabel>Kategori</SelectLabel>
                            <SelectItem value="Complain" className="border-l-8 border-red-400">Complain</SelectItem>
                            <SelectItem value="Fasilitas" className="border-l-8 border-blue-400">Fasilitas</SelectItem>
                            <SelectItem value="JKN7+" className="border-l-8 border-green-400">JKN 7+</SelectItem>
                            <SelectItem value="All" className="border-l-8">Semua Kategori</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                {/* Select Rows Per Page */}
                <div className="flex items-center space-x-2 ml-5 mr-5 mt-5 text-sm">
                    <p> Jumlah Maxsimal baris dalam 1 halaman</p>
                    <Select
                        value={rowsPerPage.toString()}
                        onValueChange={(value) => {
                            setRowsPerPage(Number(value));
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="w-20 h-7 border-blue-700 border-2">
                            <SelectValue placeholder="Rows" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="15">15</SelectItem>
                            <SelectItem value="45">45</SelectItem>
                            <SelectItem value="90">90</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>


            <div className="h-4/5 m-2 overflow-y-auto rounded-md border-2">
                {isLoadingDetail ? (
                    <img src="/images/loading.gif" alt="Loading..." />
                ) : filteredList.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-10 font-bold text-lg">No.</TableHead>
                                <TableHead className="w-32 font-bold text-lg text-center">Waktu</TableHead>
                                <TableHead className="font-bold text-lg text-center">Kejadian</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredList.map((detail, i) => (
                                <TableRow key={i}>
                                    <TableCell>{i + 1}.</TableCell>
                                    <TableCell className="w-40">
                                        {new Date(detail.tanggal).toLocaleString('id-ID', {
                                            year: "numeric",
                                            month: "numeric",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "numeric",
                                            hour12: true,
                                            timeZone: 'UTC'
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <textarea
                                            className={`p-2 w-full h-10 border rounded-lg  border-l-8 ${detail.category === "Complain" ? "border-red-400" : ""} ${detail.category === "Fasilitas" ? "border-blue-400" : ""} ${detail.category === "JKN7+" ? "border-green-400" : ""}`}
                                            value={detail.note}
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
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className='m-5'>No Data <br /> Pilih tanggal untuk mencari data yang diinginkan</div>
                )}
            </div>
            <div></div>
            {/* Pagination */}
            {totalPages > 1 && (
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
            )}
        </div>
    );
}
