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
  Link,
} from "@chakra-ui/react";
import { useEffect, useState, Fragment } from "react";
import * as api from "strateegia-api";
import Loading from "../components/Loading";
import MapList from "../components/MapList";
import ProjectList from "../components/ProjectList";
import { extractUserCommentInfo } from "../data/graphData";
import { exportTableAsCsv, exportJson } from "../utils/exportFunctions";
import { i18n } from "../translate/i18n";
import { ExportsButtons } from "../components/ExportsButtons";
import UserTable from "../components/UserTable";
import { generateDocument } from "../components/FileContent";

export default function Main() {
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedMap, setSelectedMap] = useState("");
  const [selectedDivPoint, setSelectedDivPoint] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [commentsReport, setCommentsReport] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [projectData, setProjectData] = useState(null);

  const handleSelectChange = (e) => {
    setSelectedProject(e.target.value);
    setIsLoading(true);
    async function fetchProjectData() {
      try {
        const project = await api.getProjectById(accessToken, e.target.value);
        setProjectData(project);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProjectData();
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
    async function fetchData() {
      setIsLoading(true);
      try {
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

  useEffect(() => {

    console.log("🚀 ~ file: Main.jsx ~ line 90 ~ Main ~ rawData", rawData)
    console.log("🚀 ~ file: Main.jsx ~ line 91 ~ Main ~ commentsReport", commentsReport)
  }, [commentsReport])

  return (
    <Box padding={10}>
      <Box display='flex' >
        <ProjectList handleSelectChange={handleSelectChange} />
        <Link 
          pointerEvents={selectedProject ? '' : 'none'}
          _disabled={selectedProject ? false : true}
          href={selectedProject?.length > 0 ? `https://app.strateegia.digital/journey/${selectedProject}/map/${projectData?.maps[0].id}` : '' }
          target='_blank'
          bg='#E9ECEF'
          borderRadius={' 0 6px 6px 0 '}
          fontSize={16}
          w={200} h='40px'
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          {i18n.t('main.link')}
        </Link>
      </Box>
      {/* <MapList
        projectId={selectedProject}
        handleSelectChange={handleMapSelectChange}
      /> */}
      {/* <DivPointList
        mapId={selectedMap}
        handleSelectChange={handleDivPointSelectChange}
      /> */}
      <ExportsButtons data={commentsReport?.counter || ''} rawData={rawData} saveFile={() => generateDocument(commentsReport)} project={rawData}/>
      <Loading active={isLoading} />
      <Heading as="h3" size="lg" mb={12} mt={3}>
        {i18n.t('main.heading')}
      </Heading>
      {commentsReport && (
        <Fragment>
          <Flex mt={2} justify={"end"}>
            {/* <Button
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
            </Button> */}
          </Flex>
          <UserTable accessToken={accessToken} selectedProject={selectedProject}/>
          {/* <TableContainer mt={3}>
            <Table id={"table_output"} variant={"striped"} size={"sm"}>
              <Thead>
                <Tr>
                  <Th>usuário</Th>
                  <Th>respostas às questões</Th>
                  <Th>comentários às respostas</Th>
                  <Th>concordâncias</Th>
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
          </TableContainer> */}
          {/* <Heading as={"h3"} size={"md"} mt={3}>
            dados brutos
          </Heading>
          <pre>{JSON.stringify(rawData, null, 2)}</pre> */}
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
