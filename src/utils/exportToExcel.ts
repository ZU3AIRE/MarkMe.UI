import * as XLSX from "xlsx";

/**
 * Exports the given data array to an Excel file with headings capitalized.
 * The file will be downloaded to the user's default download folder.
 * @param data Array of objects to export.
 * @param fileName Name of the file (with .xlsx extension).
 */
export function exportToExcel<T extends object>(data: T[], fileName: string) {
    if (!data || data.length === 0) return;

    // Capitalize the first letter of each heading
    const keys = Object.keys(data[0]);
    const capitalizedKeys = keys.map(
        key => key.charAt(0).toUpperCase() + key.slice(1)
    );

    // Map data to array of arrays for worksheet
    const rows = data.map(row =>
        keys.map(key => (row as unknown as Record<string, unknown>)[key])
    );

    // Combine headings and rows
    const worksheetData = [capitalizedKeys, ...rows];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, fileName);
}