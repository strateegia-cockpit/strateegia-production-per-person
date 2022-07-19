export const exportJSONData = (data) => {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(data)
  )}`;

  const link = document.createElement("a");
  link.href = jsonString;
  link.download = "strateegia_convergence_points_report-json.json";

  link.click();
}

// Ref: https://stackoverflow.com/questions/15547198/export-html-table-to-csv-using-vanilla-javascript
export function exportTableAsCsv(table_id, separator = ',') {
  // Select rows from table_id
  let rows = document.querySelectorAll('table#' + table_id + ' tr');
  // Construct csv
  let csv = [];
  for (let i = 0; i < rows.length; i++) {
    let row = [], cols = rows[i].querySelectorAll('td, th');
    for (let j = 0; j < cols.length; j++) {
      // Clean innertext to remove multiple spaces and jumpline (break csv)
      let data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
      // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
      data = data.replace(/"/g, '""');
      // Push escaped string
      row.push('"' + data + '"');
    }
    csv.push(row.join(separator));
  }
  let csv_string = csv.join('\n');
  // Download it
  let filename = 'export_' + table_id + '_' + new Date().toLocaleDateString() + '.csv';
  let link = document.createElement('a');
  link.style.display = 'none';
  link.setAttribute('target', '_blank');
  link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportJson(dataElement) {
  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataElement));
  let link = document.createElement('a');
  link.style.display = 'none';
  link.setAttribute('target', '_blank');
  // link_svg.href = url;
  link?.setAttribute("href", dataStr);
  link.setAttribute("download", "data.json");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function sortString(a, b) {
  const nameA = a.toUpperCase(); // ignore upper and lowercase
  const nameB = b.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
}