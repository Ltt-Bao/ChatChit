import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

export default function Pagination({ currentPage, totalPages, onPageChange, loading }: PaginationProps) {
  if (loading || totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
      >
        Trở lại
      </Button>
      {Array.from({ length: totalPages }, (_, i) => (
        <Button
          key={i + 1}
          variant={currentPage === i + 1 ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </Button>
      ))}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
      >
        Tiếp theo
      </Button>
    </div>
  );
}