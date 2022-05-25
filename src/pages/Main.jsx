import { Box, Heading, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import * as api from "strateegia-api";
import Loading from "../components/Loading";
import MapList from "../components/MapList";
import ProjectList from "../components/ProjectList";
import DivPointList from "../components/DivPointList";

export default function Main() {
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedMap, setSelectedMap] = useState("");
  const [selectedDivPoint, setSelectedDivPoint] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [mapDetails, setMapDetails] = useState(null);

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
    setMapDetails(null);
    setSelectedMap("");
    setSelectedDivPoint("");
  }, [selectedProject]);

  useEffect(() => {
    setSelectedDivPoint("");
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await api.getMapById(accessToken, selectedMap);
        setMapDetails({ ...response });
        console.log("mapDetails: %o", mapDetails);
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
        [applet title here]
      </Heading>
      <ProjectList handleSelectChange={handleSelectChange} />
      <MapList
        projectId={selectedProject}
        handleSelectChange={handleMapSelectChange}
      />
      <DivPointList
        mapId={selectedMap}
        handleSelectChange={handleDivPointSelectChange}
      />
      <Loading active={isLoading} />
      {/* [TODO] Add you component here */}
      {mapDetails?.points ? (
        <Box mt={3}>
          <Heading as="h3" size="md" mb={3}>
            Map Details
          </Heading>
          <Text>Title: {mapDetails?.title}</Text>
          <Text>ID: {mapDetails?.id}</Text>
          <Text>Created at: {mapDetails?.created_at}</Text>
          <Text>Points: {mapDetails?.points?.length}</Text>
          <UnorderedList>
            {mapDetails?.points?.map((point) => (
              <ListItem>
                {point.point_type}:{" "}
                {point.point_type === "CONVERSATION"
                  ? point.description
                  : point.title}
              </ListItem>
            ))}
          </UnorderedList>
        </Box>
      ) : null}
      {selectedDivPoint !== "" ? (
        <Text> Selected Divergence Point: {selectedDivPoint}</Text>
      ) : null}
    </Box>
  );
}
