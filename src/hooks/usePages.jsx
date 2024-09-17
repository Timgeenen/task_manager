import { useState } from "react"

function usePages(arrayLength, itemsPerPage) {
  const [lowestIndex, setLowestIndex] = useState(0)
  const [highestIndex, setHighestIndex] = useState(itemsPerPage - 1);
  const [page, setPage] = useState(1);
  const lastPage = Math.ceil((arrayLength) / itemsPerPage);

  const nextPage = () => {
    if (page >= lastPage) { return }
    setPage(page + 1);
    setLowestIndex(lowestIndex + itemsPerPage);
    setHighestIndex(highestIndex + itemsPerPage);
  };

  const prevPage = () => {
    if (page <= 1) { return }
    setPage(page - 1);
    setLowestIndex(lowestIndex - itemsPerPage);
    setHighestIndex(highestIndex - itemsPerPage);
  };
  return [prevPage, nextPage, lowestIndex, highestIndex, page, lastPage];
}

export default usePages
