import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Fragment } from "react";

export function ExperimentalCommentsDump({
  commentsReport,
  map,
  item,
  question,
}) {
  return (
    <TableContainer mt={3}>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>DivPoint Title</Th>
            <Th>Question</Th>
            <Th>Comment</Th>
            <Th>Author</Th>
          </Tr>
        </Thead>
        <Tbody>
          {commentsReport?.map((item) => {
            return (
              <Fragment>
                {item.commentsByQuestion.map((question) => {
                  return (
                    <Tr>
                      <Td>{item.divPoint.tool.title}</Td>
                      <Td>
                        {
                          item.divPoint.tool.questions.find(
                            (d) => d.id === question.id
                          ).question
                        }
                      </Td>
                      <Td>{question.comments[0].text}</Td>
                      <Td>{question.comments[0].author.name}</Td>
                    </Tr>
                  );
                })}
              </Fragment>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
