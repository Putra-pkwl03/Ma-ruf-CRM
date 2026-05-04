// "use client";

// import { useEffect, useState } from "react";
// import { createClient } from "../../lib/supabase";
// import { Plus, ListFilter, MoreVertical, Search, X } from "lucide-react"; // Tambah icon Search & X
// import Swal from "sweetalert2";
// import ProjectCard from "../../components/ui/projects/ProjectCard";
// import ProjectModal from "../../components/ui/projects/ProjectModal";

// export default function ProjectsPage() {
//   const [projects, setProjects] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [userRole, setUserRole] = useState<string>("");

//   // --- STATE UNTUK FILTER ---
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showFilterDropdown, setShowFilterDropdown] = useState(false);
//   const [activeTypeFilter, setActiveTypeFilter] = useState("All");

//   const supabase = createClient();

//   // Ambil Data User & Projects
//   useEffect(() => {
//     const getUserData = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (user) {
//         const { data: profile } = await supabase
//           .from("profiles")
//           .select("role")
//           .eq("id", user.id)
//           .single();
//         if (profile) setUserRole(profile.role);
//       }
//       fetchProjects();
//     };
//     getUserData();
//   }, []);

//   const fetchProjects = async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from("projects")
//       .select(
//         `
//         *,
//         leads (id, nama, kebutuhan), 
//         project_items (
//           id, negotiated_price,
//           products (name)
//         )
//       `,
//       )
//       .order("created_at", { ascending: false });

//     if (!error) setProjects(data || []);
//     setLoading(false);
//   };

//   // --- LOGIKA FILTERING ---
//   const filteredProjects = projects.filter((project) => {
//     const matchesSearch = project.leads?.nama
//       ?.toLowerCase()
//       .includes(searchQuery.toLowerCase());
//     const matchesType =
//       activeTypeFilter === "All" ||
//       project.project_items?.some((item: any) =>
//         item.products?.name.includes(activeTypeFilter),
//       );

//     return matchesSearch && matchesType;
//   });

//   const columns = [
//     { id: "waiting approval", label: "WAITING APPROVAL", dot: "bg-amber-500" },
//     { id: "approved", label: "APPROVED DEAL", dot: "bg-green-500" },
//     { id: "rejected", label: "REJECTED", dot: "bg-red-500" },
//   ];

//   // (handleApprove & handleReject tetap sama seperti kode Anda)

//   const handleApprove = async (projectId: string, leadId: string) => {
//     const result = await Swal.fire({
//       title: "Approve Deal?",
//       text: "This will convert the lead to an Active Customer.",
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#16a34a",
//       confirmButtonText: "Yes, Approve!",
//     });

//     if (result.isConfirmed) {
//       const { error: pError } = await supabase
//         .from("projects")
//         .update({ status_approval: "approved" })
//         .eq("id", projectId);

//       const { error: lError } = await supabase
//         .from("leads")
//         .update({ status: "Active" })
//         .eq("id", leadId);

//       if (!pError && !lError) {
//         Swal.fire("Success", "Deal approved & Customer activated!", "success");
//         fetchProjects();
//       } else {
//         Swal.fire("Error", "Failed to update data", "error");
//       }
//     }
//   };

//   const handleReject = async (projectId: string) => {
//     const { error } = await supabase
//       .from("projects")
//       .update({ status_approval: "rejected" })
//       .eq("id", projectId);

//     if (!error) {
//       Swal.fire("Rejected", "Deal has been rejected", "info");
//       fetchProjects();
//     }
//   };

//   return (
//     <div className="p-8 bg-[#F8FAFC] min-h-screen">
//       {/* Header */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
//             Project Deals
//           </h1>
//           <p className="text-slate-500 text-sm">
//             Track and manage your internet infrastructure projects.
//           </p>
//         </div>

//         <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
//           {/* SEARCH BAR */}
//           <div className="relative flex-1 lg:flex-none lg:w-64">
//             <Search
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//               size={16}
//             />
//             <input
//               type="text"
//               placeholder="Search customer..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="text-gray-500 w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
//             />
//           </div>

//           {/* FILTER DROPDOWN */}
//           <div className="relative">
//             <button
//               onClick={() => setShowFilterDropdown(!showFilterDropdown)}
//               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all border ${
//                 activeTypeFilter !== "All"
//                   ? "bg-blue-50 border-blue-200 text-blue-600"
//                   : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
//               }`}
//             >
//               <ListFilter size={16} />{" "}
//               {activeTypeFilter === "All" ? "Filter" : activeTypeFilter}
//             </button>

//             {showFilterDropdown && (
//               <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2">
//                 <p className="text-[10px] font-bold text-slate-500 px-3 py-2 uppercase">
//                   Service Type
//                 </p>
//                 {["All", "Home", "Business", "Dedicated"].map((type) => (
//                   <button
//                     key={type}
//                     onClick={() => {
//                       setActiveTypeFilter(type);
//                       setShowFilterDropdown(false);
//                     }}
//                     className="text-gray-500 w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-50 transition-colors"
//                   >
//                     {type}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="bg-[#0052CC] text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-md hover:bg-blue-700 transition-all"
//           >
//             <Plus size={18} /> New Deal
//           </button>
//         </div>
//       </div>

//       {/* Board */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
//         {columns.map((column) => (
//           <div key={column.id} className="flex flex-col gap-4 ">
//             <div className="flex items-center justify-between px-1">
//               <div className="flex items-center gap-2">
//                 <div className={`w-2.5 h-2.5 rounded-full ${column.dot}`} />
//                 <h2 className="font-bold text-slate-500 text-[11px] tracking-widest uppercase">
//                   {column.label}
//                 </h2>
//                 <span className="text-slate-400 text-[11px] font-bold ml-1">
//                   {
//                     filteredProjects.filter(
//                       (p) => p.status_approval === column.id,
//                     ).length
//                   }
//                 </span>
//               </div>
//               <MoreVertical
//                 size={14}
//                 className="text-slate-300 cursor-pointer hover:text-slate-500"
//               />
//             </div>

//             <div className="flex flex-col gap-4 min-h-[500px]">
//               {loading ? (
//                 <div className="flex justify-center pt-10 text-slate-400 text-xs">
//                   Loading projects...
//                 </div>
//               ) : (
//                 filteredProjects
//                   .filter((p) => p.status_approval === column.id)
//                   .map((project) => (
//                     <ProjectCard
//                       key={project.id}
//                       project={project}
//                       userRole={userRole}
//                       onApprove={handleApprove}
//                       onReject={handleReject}
//                     />
//                   ))
//               )}
//               {!loading &&
//                 filteredProjects.filter((p) => p.status_approval === column.id)
//                   .length === 0 && (
//                   <div className="border-2 border-dashed border-slate-200 rounded-2xl h-32 flex items-center justify-center text-slate-400 text-xs italic">
//                     No projects found
//                   </div>
//                 )}
//             </div>
//           </div>
//         ))}
//       </div>

//       <ProjectModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSuccess={fetchProjects}
//       />
//     </div>
//   );
// }





"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase";
import { 
  Plus, ListFilter, MoreVertical, Search, 
  ChevronLeft, ChevronRight, Hash 
} from "lucide-react";
import Swal from "sweetalert2";
import ProjectCard from "../../components/ui/projects/ProjectCard";
import ProjectModal from "../../components/ui/projects/ProjectModal";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>("");

  // --- STATE FILTER & PAGINATION ---
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeTypeFilter, setActiveTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // 3 per kolom

  const supabase = createClient();

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        if (profile) setUserRole(profile.role);
      }
      fetchProjects();
    };
    getUserData();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select(`*, leads (id, nama, kebutuhan), project_items (id, negotiated_price, products (name))`)
      .order("created_at", { ascending: false });

    if (!error) setProjects(data || []);
    setLoading(false);
  };

  // --- LOGIKA FILTERING ---
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.leads?.nama?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeTypeFilter === "All" ||
      project.project_items?.some((item: any) => item.products?.name.includes(activeTypeFilter));
    return matchesSearch && matchesType;
  });

  // --- LOGIKA PAGINATION ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Fungsi untuk mendapatkan data per kolom dengan paginasi
  const getPaginatedData = (columnId: string) => {
    return filteredProjects
      .filter((p) => p.status_approval === columnId)
      .slice(indexOfFirstItem, indexOfLastItem);
  };

  const maxItemsInAnyColumn = Math.max(
    ...["waiting approval", "approved", "rejected"].map(
      (id) => filteredProjects.filter((p) => p.status_approval === id).length
    )
  );
  const totalPages = Math.ceil(maxItemsInAnyColumn / itemsPerPage);

  const columns = [
    { id: "waiting approval", label: "WAITING APPROVAL", dot: "bg-amber-500" },
    { id: "approved", label: "APPROVED DEAL", dot: "bg-green-500" },
    { id: "rejected", label: "REJECTED", dot: "bg-red-500" },
  ];


  const handleApprove = async (projectId: string, leadId: string) => {
    const result = await Swal.fire({
      title: "Approve Deal?",
      text: "This will convert the lead to an Active Customer.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      confirmButtonText: "Yes, Approve!",
    });

    if (result.isConfirmed) {
      const { error: pError } = await supabase
        .from("projects")
        .update({ status_approval: "approved" })
        .eq("id", projectId);

      const { error: lError } = await supabase
        .from("leads")
        .update({ status: "Active" })
        .eq("id", leadId);

      if (!pError && !lError) {
        Swal.fire("Success", "Deal approved & Customer activated!", "success");
        fetchProjects();
      } else {
        Swal.fire("Error", "Failed to update data", "error");
      }
    }
  };

  const handleReject = async (projectId: string) => {
    const { error } = await supabase
      .from("projects")
      .update({ status_approval: "rejected" })
      .eq("id", projectId);

    if (!error) {
      Swal.fire("Rejected", "Deal has been rejected", "info");
      fetchProjects();
    }
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Project Deals</h1>
          <p className="text-slate-500 text-sm font-medium">Manage internet infrastructure pipeline.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
//           {/* SEARCH BAR */}
        <div className="relative flex-1 lg:flex-none lg:w-64">
          <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-gray-500 w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {/* FILTER DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all border ${
                activeTypeFilter !== "All"
                  ? "bg-blue-50 border-blue-200 text-blue-600"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
          <ListFilter size={16} />{" "}
         {activeTypeFilter === "All" ? "Filter" : activeTypeFilter}
      </button>

  {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2">
                <p className="text-[10px] font-bold text-slate-500 px-3 py-2 uppercase">
                  Service Type
                </p>
                {["All", "Home", "Business", "Dedicated"].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setActiveTypeFilter(type);
                      setShowFilterDropdown(false);
                    }}
                    className="text-gray-500 w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
       <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0052CC] text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-md hover:bg-blue-700 transition-all"
            >
            <Plus size={18} /> New Deal
          </button>
      
            </div>
        </div>

      {/* Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col gap-5">
            {/* Column Header */}
            <div className="flex items-center justify-between bg-white/50 p-2 rounded-xl backdrop-blur-sm border border-white">
              <div className="flex items-center gap-2 px-2">
                <div className={`w-2 h-2 rounded-full ${column.dot} animate-pulse`} />
                <h2 className="font-black text-slate-400 text-[10px] tracking-[0.15em] uppercase">{column.label}</h2>
                <div className="bg-slate-200/50 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                   {filteredProjects.filter(p => p.status_approval === column.id).length}
                </div>
              </div>
              <MoreVertical size={14} className="text-slate-300 cursor-pointer" />
            </div>

            {/* Area Cards */}
            <div className="flex flex-col gap-4 min-h-[450px]">
              {loading ? (
                <div className="flex justify-center pt-10 text-slate-400 text-xs font-medium animate-pulse">Syncing data...</div>
              ) : (
                getPaginatedData(column.id).map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    userRole={userRole} 
                    onApprove={handleApprove} 
                    onReject={handleReject} 
                  />
                ))
              )}
              {!loading && getPaginatedData(column.id).length === 0 && (
                <div className="group border-2 border-dashed border-slate-200 rounded-3xl h-40 flex flex-col items-center justify-center text-slate-400 transition-colors hover:border-blue-200 hover:bg-blue-50/30">
                  <Hash size={24} className="mb-2 opacity-20 group-hover:opacity-40 transition-opacity" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">No Projects</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modern Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-600"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-1 px-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110"
                      : "text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-600"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      )}

      <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchProjects} />
    </div>
  );
}
