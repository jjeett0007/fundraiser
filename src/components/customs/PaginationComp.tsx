import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState, useCallback } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export default function PaginationComp({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const [isLocked, setIsLocked] = useState(false);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages && !isLocked) {
        setIsLocked(true);
        onPageChange(newPage);

        window.scrollTo({ top: 0, behavior: "smooth" });

        setTimeout(() => setIsLocked(false), 1000);
      }
    },
    [onPageChange, totalPages, isLocked]
  );

  const handlePreviousClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    handlePageChange(currentPage - 1);
  };

  const handleNextClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    handlePageChange(currentPage + 1);
  };

  const handlePageClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    page: number
  ) => {
    e.preventDefault();
    handlePageChange(page);
  };

  const startPage = Math.max(currentPage - 1, 1);
  const endPage = Math.min(currentPage + 1, totalPages);

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            className="cursor-pointer"
            onClick={handlePreviousClick}
          />
        </PaginationItem>
        {pageNumbers.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              className={`cursor-pointer border ${
                page === currentPage
                  ? "font-bold border cursor-not-allowed border-primary  "
                  : "border-none"
              }`}
              onClick={(e) => handlePageClick(e, page)}
              aria-disabled={page === currentPage}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {endPage < totalPages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            className="cursor-pointer"
            onClick={handleNextClick}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
} 
