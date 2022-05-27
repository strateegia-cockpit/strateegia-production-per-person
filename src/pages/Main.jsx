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
  Text,
} from "@chakra-ui/react";
import { useEffect, useState, Fragment } from "react";
import * as api from "strateegia-api";
import Loading from "../components/Loading";
import MapList from "../components/MapList";
import ProjectList from "../components/ProjectList";
import { extractUserCommentInfo } from "../data/graphData";
import * as d3 from "d3";
import { exportTableAsCsv, exportJson } from "../utils/exportFunctions";

export default function Main() {
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedMap, setSelectedMap] = useState("");
  const [selectedDivPoint, setSelectedDivPoint] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [commentsReport, setCommentsReport] = useState(null);
  const [rawData, setRawData] = useState(null);

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
        setCommentsReport({ ...response2 });
        setRawData([...response2.raw.sort((a, b) => sortString(a, b))]);
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
              marginStart={1}
              onClick={() => {
                exportJson(rawData);
              }}
            >
              json
            </Button>
          </Flex>
          <TableContainer mt={3} maxWidth={"50%"}>
            <Table id={"table_output"} variant={"striped"} size={"sm"}>
              <Thead>
                <Tr>
                  <Th>usuário</Th>
                  <Th>comments</Th>
                  <Th>replies</Th>
                  <Th>agreements</Th>
                </Tr>
              </Thead>
              <Tbody>
                {commentsReport?.counter
                  .sort((a, b) => sortString(a.user, b.user))
                  .map((comment) => {
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
          <Heading as={"h3"} size={"md"} mt={3}>
            dados brutos
          </Heading>
          <pre>{JSON.stringify(rawData, null, 2)}</pre>
        </Fragment>
      )}
    </Box>
  );
}

function sortString(a, b) {
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
