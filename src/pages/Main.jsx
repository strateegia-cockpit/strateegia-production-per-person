import {
  Box,
  Heading,

  Flex,
  Link,
} from "@chakra-ui/react";
import { useEffect, useState, Fragment } from "react";
import * as api from "strateegia-api";
import Loading from "../components/Loading";
import MapList from "../components/MapList";
import ProjectList from "../components/ProjectList";
import DivPointList from "../components/DivPointList";
import { extractUserCommentInfo, gatherData } from "../data/graphData";
import { sortString } from "../utils/exportFunctions";
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
    // gatherData(accessToken, e.target.value);
  };

  const handleMapSelectChange = (value) => {
    setSelectedMap(value);
    gatherData(accessToken, selectedProject, value);
  };

  const handleDivPointSelectChange = (value) => {
    setSelectedDivPoint(value);
    gatherData(accessToken, selectedProject, selectedMap, value);
  };

  useEffect(() => {
    setCommentsReport(null);
    setSelectedMap("");
    setSelectedDivPoint("");
  }, [selectedProject]);

  // useEffect(() => {
  //   async function fetchData() {
  //     setIsLoading(true);
  //     try {
  //       const response2 = await extractUserCommentInfo(
  //         accessToken,
  //         selectedProject
  //       );
  //       setCommentsReport({ ...response2 });
  //       setRawData([...response2.raw.sort((a, b) => sortString(a, b))]);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //     setIsLoading(false);
  //   }
  //   fetchData();
  // }, [selectedProject]);

  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken"));
  }, []);

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
      <MapList
        projectId={selectedProject}
        handleSelectChange={handleMapSelectChange}
      />
      <DivPointList
        mapId={selectedMap}
        handleSelectChange={handleDivPointSelectChange}
      />
      <ExportsButtons data={commentsReport?.counter || ''} rawData={rawData} saveFile={() => generateDocument(commentsReport)} project={rawData}/>
      <Loading active={isLoading} />
      <Heading as="h3" size="lg" mb={12} mt={3}>
        {i18n.t('main.heading')}
      </Heading>
      {selectedDivPoint && (
        <Fragment>
          <Flex mt={2} justify={"end"}>
          </Flex>
          <UserTable accessToken={accessToken} selectedProject={selectedProject} selectedMap={selectedMap} selectedDivPoint={selectedDivPoint}/>
        </Fragment>
      )}
    </Box>
  );
}


