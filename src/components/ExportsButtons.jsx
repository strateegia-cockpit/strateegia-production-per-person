import { Box } from "@chakra-ui/react";
import { ButtonExp } from "./ButtonToExport";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import * as XLSX from 'xlsx';

export function ExportsButtons({ project, users, stats, rawData, saveFile }) {
    // Convert JSON data to CSV and XLSX Blob
    const usersCsv = users ? dataToCsv(users) : null;
    const statisticsCsv = stats ? dataToCsv(stats) : null;
    const usersXlsx = users ? jsonToXLSXBlob(users) : null;
    const statisticsXlsx = stats ? jsonToXLSXBlob(stats) : null;

    const handleExportCSV = () => {
        const zip = new PizZip();
        zip.file("users_data_report.csv", usersCsv);
        zip.file("statistics_data_report.csv", statisticsCsv);
        const content = zip.generate({ type: "blob" });
        saveAs(content, "strateegia_csv_reports.zip");
    };

    // Update your handleExportXLSX to handle the ArrayBuffer
    const handleExportXLSX = () => {
      const zip = new PizZip();
      if (usersXlsx) zip.file("users_data_report.xlsx", usersXlsx);
      if (statisticsXlsx) zip.file("statistics_data_report.xlsx", statisticsXlsx);
      const content = zip.generate({ type: "blob" });
      saveAs(content, "strateegia_xlsx_reports.zip");
    };

    return (
        <Box display="flex" justifyContent="flex-end" alignItems='flex-end' m='4px'>
            <ButtonExp click={saveFile} project={project} text='docx'/>
            <ButtonExp click={handleExportXLSX} project={project} text='xlsx'/>
            <ButtonExp click={handleExportCSV} project={project} text='csv'/>
            <ButtonExp click={() => exportJSONData(rawData)} project={project} text='json'/>
        </Box>
    );
}

export const exportJSONData = (data) => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(data)
    )}`;

    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "strateegia_production_per_person_report.json";

    link.click();
};

const jsonToXLSXBlob = (jsonData) => {
  const ws = XLSX.utils.json_to_sheet(jsonData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Report");
  
  const wbout = XLSX.write(wb, { type: 'binary' });
  return s2ab(wbout); // return as ArrayBuffer
};

const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
};

function dataToCsv(data) {
    const filteredData = data && data.filter(user => user !== undefined && user !== 'empty');
    const items = filteredData;
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = items && Object.keys(items[0]);
    const csv = header && [
        header.join(','), // header row first
        ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n');
    return csv;
}
