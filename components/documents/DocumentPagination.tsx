import Button from "@/components/ui/Button";

interface DocumentPaginationProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export default function DocumentPagination({ currentPage, pageCount, onPageChange }: DocumentPaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-800 bg-slate-950/95 p-4 text-slate-300 shadow-sm shadow-slate-950/10 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-400">Page {currentPage} of {pageCount}</p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          type="button"
          className="px-4 py-2"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={`rounded-full px-4 py-2 text-sm transition ${
              page === currentPage
                ? "bg-blue-500 text-white"
                : "bg-slate-900/80 text-slate-300 hover:bg-slate-800"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        <Button
          variant="secondary"
          type="button"
          className="px-4 py-2"
          onClick={() => onPageChange(Math.min(currentPage + 1, pageCount))}
          disabled={currentPage === pageCount}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
