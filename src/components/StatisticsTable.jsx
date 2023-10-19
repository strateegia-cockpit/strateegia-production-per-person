import { Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";

import { THeader } from "./THeader";

export const StatisticsTable = ({ reportLists }) => {
  console.log('reportLists', reportLists)
  
  function ifNegativeShowZero(value) {
    if (value > 0) {
      return value.toFixed(2);
    } else {
      return 0;
    }
  }

  return (
    <Fragment>
      <Thead>
        <Tr>
          <THeader text='estatística' width={'200px'} weight={800} />
          <THeader text='respostas às questões' width={'200px'} weight={800} />
          <THeader text='comentários às respostas' width={'200px'} weight={800} />
          <THeader text='engajamento respostas' width={'200px'} weight={800} />
          <THeader text='engajamento comentários' width={'200px'} weight={800} />
          <THeader text='engajamento' width={'200px'} weight={800} />
        </Tr>
      </Thead>
      <Tbody>
        <Tr key="mean">
          <Td>média</Td>
          <Td>{ifNegativeShowZero(reportLists?.commentsListMean)}</Td>
          <Td>{ifNegativeShowZero(reportLists?.repliesListMean)}</Td>
          <Td>{ifNegativeShowZero(reportLists?.replyEngagementMean)}</Td>
          <Td>{ifNegativeShowZero(reportLists?.commentEngagementMean)}</Td>
          <Td>{ifNegativeShowZero(reportLists?.totalEngagementMean)}</Td>
        </Tr>
        <Tr key="stddev">
          <Td>desvio padrão</Td>
          <Td>{ifNegativeShowZero(reportLists?.commentsListStDev)}</Td>
          <Td>{ifNegativeShowZero(reportLists?.repliesListStDev)}</Td>
          <Td>{ifNegativeShowZero(reportLists?.replyEngagementStDev)}</Td>
          <Td>{ifNegativeShowZero(reportLists?.commentEngagementStDev)}</Td>
          <Td>{ifNegativeShowZero(reportLists?.totalEngagementStDev)}</Td>
        </Tr>
        <Tr key="coefficient">
          <Td>índice de equilíbrio</Td>
          <Td>{ifNegativeShowZero(reportLists?.commentsListEquilibriumIndex)}%</Td>
          <Td>{ifNegativeShowZero(reportLists?.repliesListEquilibriumIndex)}%</Td>
          <Td>{ifNegativeShowZero(reportLists?.replyEngagementEquilibriumIndex)}%</Td>
          <Td>{ifNegativeShowZero(reportLists?.commentEngagementEquilibriumIndex)}%</Td>
          <Td>{ifNegativeShowZero(reportLists?.totalEngagementEquilibriumIndex)}%</Td>
        </Tr>
        <Tr key="total">
          <Td>índice de equilíbrio total</Td>
          <Td colSpan={5}>{ifNegativeShowZero(reportLists?.totalEquilibriumIndex)}%</Td>
        </Tr>
      </Tbody>
    </Fragment>
  );
};
