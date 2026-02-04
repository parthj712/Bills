"use client";

import { Box, Pagination } from "@mui/material";

export default function AppPagination({
  totalItems,
  rowsPerPage = 3,
  page,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
}) {
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  if (totalPages === 0) return null; // Hide if no pages

  return (
    <Box className="flex justify-center mt-4">
      <Pagination
        count={totalPages}
        page={page}
        onChange={onPageChange}
        color="primary"
        siblingCount={siblingCount}
        boundaryCount={boundaryCount}
      />
    </Box>
  );
}
