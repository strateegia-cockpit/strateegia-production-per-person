import { Box } from "@chakra-ui/react";
import { ButtonExp } from "./ButtonToExport";
import PizZip from "pizzip";
import { saveAs } from "file-saver";

export function ExportsButtons({ project, users, stats, rawData, saveFile }) {

    const usersCsv = users ? dataToCsv(users) : null;
    const statisticsCsv = stats ? dataToCsv(stats) : null;

    const zip = new PizZip;
    zip.file("strateegia_production_per_person_users_data_report-csv.csv", usersCsv);
    zip.file("strateegia_production_per_person_statistics_data_report-csv.csv", statisticsCsv);
    
    const content = zip.generate({type: "blob"});

  return (
    <Box display="flex" justifyContent="flex-end" alignItems='flex-end' m='4px'>
      <ButtonExp click={saveFile} project={project} text='docx'/>
      <ButtonExp click={() => saveAs(content, "strateegia_production_per_person_report-csv.zip")} project={project} text='csv'/>
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
  link.download = "strateegia_production_per_person_report-json.json";

  link.click();
};

function dataToCsv(data) {
  const items = data;
  const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
  const header = Object.keys(items[0]);
  const csv = [
    header.join(','), // header row first
    ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
  ].join('\r\n');
  return csv;
}