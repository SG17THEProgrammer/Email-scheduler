import Papa from "papaparse";

export function parseCSV(file: File): Promise<string[]> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      skipEmptyLines: true,
      complete: (result: { data: any[]; }) => {
        const emails = result.data
          .flat()
          .filter(
            (v: any) =>
              typeof v === "string" && v.includes("@")
          );
        resolve(emails);
      },
    });
  });
}
