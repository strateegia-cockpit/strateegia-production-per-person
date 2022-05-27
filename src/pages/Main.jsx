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
  Button,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState, Fragment } from "react";
import * as api from "strateegia-api";
import Loading from "../components/Loading";
import MapList from "../components/MapList";
import ProjectList from "../components/ProjectList";
import { extractUserCommentInfo } from "../data/graphData";
import * as d3 from "d3";
import { ExportsButtons } from "../components/ExportsButtons";
import { exportTableAsCsv } from "../utils/exportFunctions";

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
        // const response = await api.getMapById(accessToken, selectedMap);
        // const divPointsRequest = [];
        // response?.points
        //   ?.filter((point) => point.point_type === "DIVERGENCE")
        //   .forEach((divPoint) => {
        //     console.log(divPoint.title);
        //     divPointsRequest.push(
        //       api
        //         .getDivergencePointById(accessToken, divPoint.id)
        //         .then((divPointRes) => {
        //           return api
        //             .getCommentsGroupedByQuestionReport(
        //               accessToken,
        //               divPoint.id
        //             )
        //             .then((res) => {
        //               return {
        //                 divPoint: divPointRes,
        //                 commentsByQuestion: res,
        //               };
        //             });
        //         })
        //     );
        //   });
        // const divPointsResponse = await Promise.all(divPointsRequest);
        // console.log("divPoints %o", divPointsResponse);
        // setCommentsReport([...divPointsResponse]);
        // console.log("mapDetails: %o", response);
        // [TODO] - use the access token to fetch the data
        // [TODO] - add the fetch data function here
        const response2 = await extractUserCommentInfo(
          accessToken,
          selectedProject
        );
        setCommentsReport([...response2]);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [selectedProject]);

  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken"));
  }, []);

  return (
    <Box padding={10}>
      <Heading as="h3" size="md" mb={3}>
        relatório de comentários
      </Heading>
      <ProjectList handleSelectChange={handleSelectChange} />
      {/* <MapList
        projectId={selectedProject}
        handleSelectChange={handleMapSelectChange}
      /> */}
      {/* <DivPointList
        mapId={selectedMap}
        handleSelectChange={handleDivPointSelectChange}
      /> */}
      <Loading active={isLoading} />

      {/* [TODO] Add you component here */}
      {commentsReport && (
        <Fragment>
          <Flex mt={2} justify={"end"}>
            <Button
              size="xs"
              fontSize="14px"
              fontWeight="400"
              bg="#6c757d"
              color="#fff"
              borderRadius="3px"
              _hover={{
                bg: "#5C636A",
              }}
              paddingBottom={"4px"}
              onClick={() => {
                exportTableAsCsv("table_output", ",");
              }}
            >
              csv
            </Button>
          </Flex>
          <TableContainer mt={3}>
            <Table id={"table_output"}>
              <Thead>
                <Tr>
                  <Th>usuário</Th>
                  <Th>comments</Th>
                  <Th>replies</Th>
                  <Th>agreements</Th>
                </Tr>
              </Thead>
              <Tbody>
                {commentsReport?.map((comment) => {
                  return (
                    <Tr key={comment.user}>
                      <Td>{comment.user}</Td>
                      <Td>{comment.comments || 0}</Td>
                      <Td>{comment.replies || 0}</Td>
                      <Td>{comment.agreements || 0}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>

          <pre>{JSON.stringify(commentsReport, null, 2)}</pre>
        </Fragment>
      )}
    </Box>
  );
}
