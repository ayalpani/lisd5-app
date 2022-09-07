import { useCallback, useEffect, useState } from 'react';

export default function useInfiniteData<T>(
  fetchDataMethod: (page: number, pageSize: number) => Promise<T[]>,
  pageSize: number
) {
  const [page, setPage] = useState(1);
  // default this to true to kick the initial effect hook to
  // fetch the first page
  const [shouldFetch, setShouldFetch] = useState(true);
  const [data, setData] = useState<T[]>([]);

  // return this function for Flatlist to call onEndReached
  const fetchMore = useCallback(() => {
    setShouldFetch(true);
  }, []);

  useEffect(
    () => {
      // prevent fetching for other state changes
      if (!shouldFetch) {
        return;
      }

      const isDataPageAlreadyLoaded = page * pageSize === data.length;
      if (isDataPageAlreadyLoaded) {
        return;
      }

      const fetch = async () => {
        const newData: T[] = await fetchDataMethod(page, pageSize);

        // set the should fetch call to false to prevent fetching
        // on page number update
        setShouldFetch(false);
        setData((oldData) => [...oldData, ...newData]);

        //increment page for the next call
        setPage(page + 1);
      };

      fetch();
      console.log('useInfiniteData:data fetch()', {
        page,
        pageSize,
        dataLength: data.length,
      });
    },
    // prevent fetching for other state changes
    [data.length, fetchDataMethod, page, pageSize, shouldFetch]
  );
  // console.log('useInfiniteData', { page, dataLength: data.length });
  return { data, fetchMore };
}
