import { Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";
import { mean, stdev } from "stats-lite";
import { THeader } from "./THeader";

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

  function ifNegativeShowZero(value) {
    if (value > 0) {
      return value.toFixed(2)
    } else {
      return 0
    }
  }

  return (
    <Fragment>
      <Thead>
        <Tr>
          <THeader text='estatística' width={'200px'}/>
          <THeader text='respostas às questões' width={'200px'}/>
          <THeader text='comentários às respostas' width={'200px'}/>
        </Tr>
      </Thead>
      <Tbody>
        <Tr key="mean">
          <Td>média</Td>
          <Td>{ifNegativeShowZero(reportLists?.commentsListMean)}</Td>
          <Td>{ifNegativeShowZero(reportLists?.repliesListMean)}</Td>
          <Td></Td>
        </Tr>
        {/* ifNegativeShowZero() */}
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
          <Td>{ifNegativeShowZero(reportLists?.commentsListStDev)}</Td>
          <Td>{ifNegativeShowZero(reportLists?.repliesListStDev)}</Td>
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
          <Td>{ifNegativeShowZero(reportLists?.commentsListEquilibriumIndex)}%</Td>
          <Td>{ifNegativeShowZero(reportLists?.repliesListEquilibriumIndex)}%</Td>
          <Td></Td>
        </Tr>
        <Tr key="total">
          <Td>índice de equilíbrio total</Td>
          <Td colspan={3}>{ifNegativeShowZero(reportLists?.totalEquilibriumIndex)}%</Td>
        </Tr>
      </Tbody>
      <br></br>
    </Fragment>
  );
};


