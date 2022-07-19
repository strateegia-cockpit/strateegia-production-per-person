import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { reportsCockpit } from '../assets/files' 
import { saveAs } from "file-saver";
import { sortString } from "../utils/exportFunctions";

function loadFile(url, callback) {
    PizZipUtils.getBinaryContent(url, callback);
}

function ifNegativeShowZero(value) {
    if (value > 0) {
      return value.toFixed(2)
    } else {
      return 0
    }
  }

export const generateDocument = (commentsReport, reportLists) => {

    loadFile(
        reportsCockpit,
        function (error, content) {
            if (error) {
                throw error;
            }
            const zip = new PizZip(content);
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });

            const docData = commentsReport?.sort((a, b) => sortString(a["name"], b["name"]))
            .map(({name, comments, replies, agreements}, i) => {
                const blueRow = {
                    'hasBlue': true,
                    'hasWhite': false,
                    'name': name.toLowerCase(),
                    'answer': comments || 0,
                    'comment': replies || 0,
                    'agree': agreements || 0,
                };
                const whiteRow = {
                    'hasBlue': false,
                    'hasWhite': true,
                    'name_2': name.toLowerCase(),
                    'answer_2': comments || 0,
                    'comment_2': replies || 0,
                    'agree_2': agreements || 0,
                };
                
                return i % 2 == 0 ? blueRow : whiteRow;
            });
            
            doc.render({
                'td1_1': ifNegativeShowZero(reportLists?.commentsListMean),
                'td1_2': ifNegativeShowZero(reportLists?.repliesListMean),
                'td2_1': ifNegativeShowZero(reportLists?.commentsListStDev),
                'td2_2': ifNegativeShowZero(reportLists?.repliesListStDev),
                'td3_1': ifNegativeShowZero(reportLists?.commentsListEquilibriumIndex),
                'td3_2': ifNegativeShowZero(reportLists?.repliesListEquilibriumIndex),
                'td4_1': ifNegativeShowZero(reportLists?.totalEquilibriumIndex),
                'person': docData
            });

            const out = doc.getZip().generate({
                type: "blob",
                mimeType:
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }); //Output the document using Data-URI
            saveAs(out, "strateegia_production_per_person_report-docx.docx");
        }
    );

}
