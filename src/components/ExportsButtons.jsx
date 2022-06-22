import { Button, Box } from "@chakra-ui/react";
import { CSVLink } from "react-csv";
import { ButtonExp } from "./ButtonToExport";

export function ExportsButtons({ project, data, rawData, saveFile }) {
  
  return (
    <Box display="flex" justifyContent="flex-end" alignItems='flex-end' m='4px'>
      <ButtonExp click={saveFile} project={project} text='docx'/>
      <CSVLink
        data={data}
        filename="strateegia_production_per_person_report-csv.csv"
      >
        <ButtonExp click={null} project={project} text='csv'/>
      </CSVLink>
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