import { useCallback } from "react";

/* Helper function to convert an array of objects to CSV string */
const convertToCsv = (data: Record<string, unknown>[]) => {
  if (!data || !data.length) {
    return "";
  }

  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((row) =>
    Object.values(row)
      .map(
        (value) => `"${String(value).replace(/"/g, '""')}"`, // Escape double quotes
      )
      .join(","),
  );

  return [headers, ...rows].join("\r\n");
};

/* Hook to export data to CSV */
const useExportToCsv = (filename = "export.csv") => {
  const exportToCsv = useCallback(
    (data: Record<string, unknown>[]) => {
      const csvString = convertToCsv(data);
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

      // Create a link to download the CSV file
      const link = document.createElement("a");
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    [filename],
  );

  return exportToCsv;
};

export default useExportToCsv;
