"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Panel from "@/components/ui/Panel";
import SectionHeading from "@/components/ui/SectionHeading";
import DocumentFilterBar from "@/components/documents/DocumentFilterBar";
import DocumentTable from "@/components/documents/DocumentTable";
import DocumentCards from "@/components/documents/DocumentCards";
import DocumentPagination from "@/components/documents/DocumentPagination";
import type { DocumentItem } from "@/lib/documents";
import { fetchUserDocuments, renameDocument, deleteDocument, downloadDocument } from "@/lib/documents";

const pageSizes = [5, 8, 12] as const;

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortKey, setSortKey] = useState<"name" | "date" | "size">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [pageSize, setPageSize] = useState<number>(8);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  const filteredDocuments = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return documents
      .filter((document) => {
        const matchesSearch = !normalizedSearch || document.name.toLowerCase().includes(normalizedSearch) || document.type.toLowerCase().includes(normalizedSearch) || document.status.toLowerCase().includes(normalizedSearch);
        const matchesStatus = statusFilter === "All" || document.status === statusFilter;
        const matchesType = typeFilter === "All" || document.type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((a, b) => {
        if (sortKey === "name") {
          return sortDirection === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }

        if (sortKey === "size") {
          return sortDirection === "asc" ? a.size - b.size : b.size - a.size;
        }

        const dateA = new Date(a.uploadedAt).getTime();
        const dateB = new Date(b.uploadedAt).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [documents, searchQuery, statusFilter, typeFilter, sortKey, sortDirection]);

  const pageCount = Math.max(1, Math.ceil(filteredDocuments.length / pageSize));
  const currentDocuments = filteredDocuments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const showEmptyState = !isLoading && filteredDocuments.length === 0;
  const showTable = !isLoading && filteredDocuments.length > 0;

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  const handleSortKeyChange = (value: string) => {
    setSortKey(value as "name" | "date" | "size");
  };

  const handleToggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handleStartEdit = (document: DocumentItem) => {
    setEditingId(document.id);
    setDraftName(document.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDraftName("");
  };

  const handleSave = async (id: string) => {
    try {
      const updated = await renameDocument(id, draftName);
      setDocuments((prev) => prev.map((d) => (d.id === id ? updated : d)));
      handleCancelEdit();
      setMessage("Document renamed successfully.");
      setMessageType("success");
    } catch (error) {
      console.error("Rename failed", error);
      setMessage(error instanceof Error ? error.message : "Unable to rename document.");
      setMessageType("error");
    }
  };

  const handleDelete = async (id: string, path: string) => {
    try {
      await deleteDocument(id, path);
      setDocuments((prev) => prev.filter((document) => document.id !== id));
      setMessage("Document deleted successfully.");
      setMessageType("success");
    } catch (error) {
      console.error("Delete failed", error);
      setMessage(error instanceof Error ? error.message : "Unable to delete document.");
      setMessageType("error");
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const url = await downloadDocument(id);
      window.open(url, "_blank");
      setMessage("Download started.");
      setMessageType("success");
    } catch (error) {
      console.error("Download failed", error);
      setMessage(error instanceof Error ? error.message : "Unable to download document.");
      setMessageType("error");
    }
  };

  const refreshDocuments = async () => {
    try {
      const docs = await fetchUserDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to fetch documents", error);
      setMessage("Unable to load documents.");
      setMessageType("error");
    }
  };

  useEffect(() => {
    refreshDocuments();

    const storageHandler = (e: StorageEvent) => {
      if (e.key === "documents-updated") {
        refreshDocuments();
      }
    };

    window.addEventListener("storage", storageHandler);

    return () => {
      window.removeEventListener("storage", storageHandler);
    };
  }, []);

  return (
    <div className="space-y-8">
      <SectionHeading title="Documents" subtitle="Manage your uploaded documents, review status, sort results, and update file names in one place." />

      {message ? (
        <div className={`rounded-[1.5rem] border p-4 text-sm ${messageType === "success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-rose-500/30 bg-rose-500/10 text-rose-200"}`}>
          {message}
        </div>
      ) : null}

      <DocumentFilterBar
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        sortKey={sortKey}
        sortDirection={sortDirection}
        pageSize={pageSize}
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
        onTypeChange={handleTypeChange}
        onSortKeyChange={handleSortKeyChange}
        onToggleSortDirection={handleToggleSortDirection}
        onPageSizeChange={handlePageSizeChange}
      />

      <Panel title="Document library" description="Browse every file in your workspace or switch to the mobile-friendly card view below.">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-400">{filteredDocuments.length} documents found</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" type="button" onClick={() => setIsLoading((value) => !value)}>
                {isLoading ? "Hide loading" : "Show loading"}
              </Button>
              <Button variant="ghost" type="button" onClick={refreshDocuments}>
                Refresh list
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(pageSize)].map((_, index) => (
                <div key={index} className="animate-pulse rounded-[2rem] border border-slate-800 bg-slate-950/90 p-6">
                  <div className="mb-4 h-4 w-1/4 rounded-full bg-slate-800" />
                  <div className="grid gap-3 sm:grid-cols-4">
                    <div className="h-3 rounded-full bg-slate-800" />
                    <div className="h-3 rounded-full bg-slate-800" />
                    <div className="h-3 rounded-full bg-slate-800" />
                    <div className="h-3 rounded-full bg-slate-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : showEmptyState ? (
            <div className="rounded-[2rem] border border-dashed border-slate-700 bg-slate-950/90 p-10 text-center">
              <p className="text-sm uppercase tracking-[0.24em] text-blue-300">No documents yet</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">Your document library is empty</h3>
              <p className="mt-2 text-sm leading-7 text-slate-400">Upload documents to get started. Search, filters, sort, rename and delete are all ready for your workspace.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="hidden lg:block">
                <DocumentTable
                  documents={currentDocuments}
                  editingId={editingId}
                  draftName={draftName}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onChangeDraft={setDraftName}
                  onSave={handleSave}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                />
              </div>

              <div className="lg:hidden">
                <DocumentCards
                  documents={currentDocuments}
                  editingId={editingId}
                  draftName={draftName}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onChangeDraft={setDraftName}
                  onSave={handleSave}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                />
              </div>
            </div>
          )}
        </div>
      </Panel>

      <DocumentPagination currentPage={currentPage} pageCount={pageCount} onPageChange={setCurrentPage} />
    </div>
  );
}
