import {
  Box,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState, Fragment } from "react";
import * as api from "strateegia-api";
import Loading from "../components/Loading";
import MapList from "../components/MapList";
import ProjectList from "../components/ProjectList";

export default function Main() {
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedMap, setSelectedMap] = useState("");
  const [selectedDivPoint, setSelectedDivPoint] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [commentsReport, setCommentsReport] = useState(null);

  const handleSelectChange = (e) => {
    setSelectedProject(e.target.value);
  };

  const handleMapSelectChange = (e) => {
    setSelectedMap(e.target.value);
  };

  const handleDivPointSelectChange = (e) => {
    setSelectedDivPoint(e.target.value);
  };

  useEffect(() => {
    setCommentsReport(null);
    setSelectedMap("");
    setSelectedDivPoint("");
  }, [selectedProject]);

  useEffect(() => {
    setSelectedDivPoint("");
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await api.getMapById(accessToken, selectedMap);
        const divPointsRequest = [];
        response?.points
          ?.filter((point) => point.point_type === "DIVERGENCE")
          .forEach((divPoint) => {
            console.log(divPoint.title);
            divPointsRequest.push(
              api
                .getDivergencePointById(accessToken, divPoint.id)
                .then((divPointRes) => {
                  return api
                    .getCommentsGroupedByQuestionReport(
                      accessToken,
                      divPoint.id
                    )
                    .then((res) => {
                      return {
                        divPoint: divPointRes,
                        commentsByQuestion: res,
                      };
                    });
                })
            );
          });
        const divPointsResponse = await Promise.all(divPointsRequest);
        console.log("divPoints %o", divPointsResponse);
        setCommentsReport([...divPointsResponse]);
        // console.log("mapDetails: %o", response);
        // [TODO] - use the access token to fetch the data
        // [TODO] - add the fetch data function here
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [selectedMap]);

  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken"));
  }, []);

  return (
    <Box padding={10}>
      <Heading as="h3" size="md" mb={3}>
        relatório de comentários
      </Heading>
      <ProjectList handleSelectChange={handleSelectChange} />
      <MapList
        projectId={selectedProject}
        handleSelectChange={handleMapSelectChange}
      />
      {/* <DivPointList
        mapId={selectedMap}
        handleSelectChange={handleDivPointSelectChange}
      /> */}
      <Loading active={isLoading} />
      {/* [TODO] Add you component here */}
      {commentsReport ? (
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
      ) : null}
    </Box>
  );
}
