import { Tbody, Td, Thead, Tr } from "@chakra-ui/react";
import { Fragment } from "react";

import { THeader } from "./THeader";

export const StatisticsTable = ({ reportLists }) => {
  

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
          <Td textAlign={'center'}>média</Td>
          <Td textAlign={'center'}>{ifNegativeShowZero(reportLists?.commentsListMean)}</Td>
          <Td textAlign={'center'}>{ifNegativeShowZero(reportLists?.repliesListMean)}</Td>
          <Td textAlign={'center'}>{ifNegativeShowZero(reportLists?.commentEngagementMean)} %</Td>
          <Td textAlign={'center'}>{ifNegativeShowZero(reportLists?.replyEngagementMean)} %</Td>
          <Td textAlign={'center'}>{ifNegativeShowZero(reportLists?.totalEngagementMean)} %</Td>
          <Td textAlign={'center'}></Td>
        </Tr>
        {/* ifNegativeShowZero() */}
        {/* <Tr key="median">
          <Td textAlign={'center'}>mediana</Td>
          <Td textAlign={'center'}>{calculateMedian("comments")}</Td>
          <Td textAlign={'center'}>{calculateMedian("replies")}</Td>
          <Td textAlign={'center'}></Td>
        </Tr>
        <Tr key="mode">
          <Td textAlign={'center'}>moda</Td>
          <Td textAlign={'center'}>{calculateMode("comments")}</Td>
          <Td textAlign={'center'}>{calculateMode("replies")}</Td>
          <Td textAlign={'center'}></Td>
        </Tr> */}
        <Tr key="stddev">
          <Td textAlign={'center'}>desvio padrão</Td>
          <Td textAlign={'center'}>{ifNegativeShowZero(reportLists?.commentsListStDev)}</Td>
          <Td textAlign={'center'}>{ifNegativeShowZero(reportLists?.repliesListStDev)}</Td>
          <Td textAlign={'center'}>{ifNegativeShowZero(reportLists?.commentEngagementStDev)} %</Td>
          <Td textAlign={'center'}>{ifNegativeShowZero(reportLists?.replyEngagementStDev)} %</Td>
          <Td textAlign={'center'}>{ifNegativeShowZero(reportLists?.totalEngagementStDev)} %</Td>
          <Td textAlign={'center'}></Td>
        </Tr>
        {/* <Tr key="variance">
          <Td textAlign={'center'}>variância</Td>
          <Td textAlign={'center'}>{calculateVariance("comments")}</Td>
          <Td textAlign={'center'}>{calculateVariance("replies")}</Td>
          <Td textAlign={'center'}></Td>
        </Tr> */}
        <Tr key="coefficient">
          <Td textAlign={'center'}>índice de equilíbrio</Td>
          <Td textAlign={'center'}>{ifNegativeShowZero(reportLists?.commentsListEquilibriumIndex)}%</Td>
          <Td textAlign={'center'}>{ifNegativeShowZero(reportLists?.repliesListEquilibriumIndex)}%</Td>
          <Td textAlign={'center'}>Não se aplica</Td>
          <Td textAlign={'center'}>Não se aplica</Td>
          <Td textAlign={'center'}>Não se aplica</Td>
          <Td textAlign={'center'}></Td>
        </Tr>
        <Tr key="total">
          <Td textAlign={'center'}>índice de equilíbrio - respostas e comentários</Td>
          <Td textAlign={'center'} colSpan={3}>{ifNegativeShowZero(reportLists?.totalEquilibriumIndex)}%</Td>
        </Tr>
      </Tbody>
    </Fragment>
  );
};
