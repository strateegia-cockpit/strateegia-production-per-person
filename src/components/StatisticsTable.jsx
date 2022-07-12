import { Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";
import { mean, stdev } from "stats-lite";

export const StatisticsTable = ({ commentsReport }) => {
  const [reportLists, setReportLists] = useState(null);

  useEffect(() => {
    const filteredUsers = commentsReport ? commentsReport.filter(user => user !== undefined && user !== 'empty') : commentsReport
    if (filteredUsers) {
      const commentsList = filteredUsers.map((d) => d.comments || 0);
      const repliesList = filteredUsers.map((d) => d.answers || 0);
      const commentsListMean = mean(commentsList);
      const commentsListStDev = stdev(commentsList);
      const commentsListEquilibriumIndex =
        (1 - commentsListStDev / commentsListMean) * 100;
      const repliesListMean = mean(repliesList);
      const repliesListStDev = stdev(repliesList);
      const repliesListEquilibriumIndex =
        (1 - repliesListStDev / repliesListMean) * 100;
      const totalEquilibriumIndex =
        (commentsListEquilibriumIndex + repliesListEquilibriumIndex) / 2;
      const outputLists = {
        commentsListMean,
        commentsListStDev,
        commentsListEquilibriumIndex,
        repliesListMean,
        repliesListStDev,
        repliesListEquilibriumIndex,
        totalEquilibriumIndex,
      };
      // console.log("output %o", outputLists);
      setReportLists({ ...outputLists });
    } else {
      setReportLists(null);
    }
  }, [commentsReport]);

  return (
    <Fragment>
      <Thead>
        <Tr>
          <Th>estatística</Th>
          <Th>respostas às questões</Th>
          <Th>comentários às respostas</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr key="mean">
          <Td>média</Td>
          <Td>{reportLists?.commentsListMean.toFixed(2)}</Td>
          <Td>{reportLists?.repliesListMean.toFixed(2)}</Td>
          <Td></Td>
        </Tr>
        {/* <Tr key="median">
          <Td>mediana</Td>
          <Td>{calculateMedian("comments")}</Td>
          <Td>{calculateMedian("replies")}</Td>
          <Td></Td>
        </Tr>
        <Tr key="mode">
          <Td>moda</Td>
          <Td>{calculateMode("comments")}</Td>
          <Td>{calculateMode("replies")}</Td>
          <Td></Td>
        </Tr> */}
        <Tr key="stddev">
          <Td>desvio padrão</Td>
          <Td>{reportLists?.commentsListStDev.toFixed(2)}</Td>
          <Td>{reportLists?.repliesListStDev.toFixed(2)}</Td>
          <Td></Td>
        </Tr>
        {/* <Tr key="variance">
          <Td>variância</Td>
          <Td>{calculateVariance("comments")}</Td>
          <Td>{calculateVariance("replies")}</Td>
          <Td></Td>
        </Tr> */}
        <Tr key="coefficient">
          <Td>índice de equilíbrio</Td>
          <Td>{reportLists?.commentsListEquilibriumIndex.toFixed(2)}%</Td>
          <Td>{reportLists?.repliesListEquilibriumIndex.toFixed(2)}%</Td>
          <Td></Td>
        </Tr>
        <Tr key="total">
          <Td>índice de equilíbrio total</Td>
          <Td colspan={3}>{reportLists?.totalEquilibriumIndex.toFixed(2)}%</Td>
        </Tr>
      </Tbody>
      <br></br>
    </Fragment>
  );
};
