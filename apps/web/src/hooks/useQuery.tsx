import { useMemo } from "react";
import { useLocation } from "react-router-dom";

/**
 * A custom hook that parses the query string of the URL.
 * It uses `useLocation` from `react-router-dom` to get the current location object,
 * and then extracts the search string from it. This search string is then passed
 * to `URLSearchParams` to parse it into a query object. The parsing is memoized
 * to avoid unnecessary re-renders.
 *
 * @returns {URLSearchParams} An instance of URLSearchParams which can be used to access the query parameters.
 */
export const useQuery = () => {
  const { search } = useLocation();
  const decoded = new URLSearchParams(decodeURIComponent(search));

  for (const [key, value] of decoded.entries()) {
    const newValue = value.startsWith("-----BEGIN RSA PRIVATE KEY-----")
      ? `-----BEGIN RSA PRIVATE KEY-----${value
          .substring(31, value.length - 31)
          .replace(/ /g, "+")}-----END RSA PRIVATE KEY-----`
      : value.replace(/ /g, "+");
    decoded.set(key, newValue);
  }

  return useMemo(() => decoded, [decoded]);
};
