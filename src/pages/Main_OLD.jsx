import { Box, ListItem, UnorderedList, Heading, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import * as api from 'strateegia-api';
import MapList from '../components/MapList';
import ProjectList from '../components/ProjectList';

export default function Main() {
  const initialTextForCreate =
    'Questão 1: Opção 1.1; Opção 2.2;\nQuestão 2: Opção 2.1; Opção 2.2; Opção 2.3';

  const [selectedProject, setSelectedProject] = useState('');
  const [selectedMap, setSelectedMap] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [convergencePoints, setConvergencePoints] = useState([]);
  
  const [accessToken, setAccessToken] = useState('');
  const [isCreate, setIsCreate] = useState(false);
  const [textForCreate, setTextForCreate] = useState(initialTextForCreate);

  const handleInputChange = e => {
    let inputValue = e.target.value;
    setTextForCreate(inputValue);
  };

  const handleSelectChange = e => {
    setSelectedProject(e.target.value);
  };

  const handleMapSelectChange = e => {
    setSelectedMap(e.target.value);
  };

  function listOrCreate(e) {
    if (e.target.checked) {
      setIsCreate(true);
    } else {
      setIsCreate(false);
    }
  }

  useEffect(() => {
    setConvergencePoints([]);
  }, [selectedProject]);

  useEffect(() => {
    setConvergencePoints([]);
    async function fetchConvergencePoints() {
      try {
        setIsLoading(true);
        const response = await api.getMapById(accessToken, selectedMap);
        // console.log(response);
        const convergencePointsFromApi = response.points.filter(
          content => content.point_type === 'CONVERGENCE'
        );
        // console.log(convergencePointsFromApi);
        const allApiCalls = [];
        convergencePointsFromApi.forEach(element => {
          allApiCalls.push(
            api.getConvergencePointById(accessToken, element.id)
          );
        });
        Promise.all(allApiCalls).then(values => {
          // console.log("values");
          // console.log(values);
          setConvergencePoints(convPoints => [...values]);
          console.log('convPoints');
          console.log(convergencePoints);
          setIsLoading(false);
        });
      } catch (error) {
        console.log(error);
      }
    }
    fetchConvergencePoints();
  }, [selectedMap]);

  useEffect(() => {
    setAccessToken(localStorage.getItem('accessToken'));
  }, []);

  return (
    <Box padding={10}>
      <Heading as="h3" size="md" mb={3}>
        listas de convergências
      </Heading>
      <ProjectList handleSelectChange={handleSelectChange} />
      <MapList
        projectId={selectedProject}
        handleSelectChange={handleMapSelectChange}
      />
      <ConvergencePointList convergencePoints={convergencePoints} />
    </Box>
  );
}

function ConvergencePointList({ convergencePoints }) {
  // console.log('convergencePoints', convergencePoints)
  const [csv, setCsv] = useState([]);

  useEffect(() => {
    setCsv([])
    convergencePoints.map(point => point.questions.map(({text, options}) => {
      setCsv(csv => [...csv, {text: text, option: options.map(({text}) => text), results: options.map(({average}) => (average * 100).toFixed(2) + '%')} ]);
    }));
    
  }, [convergencePoints])

  // useEffect(() => {
    console.log('csv' ,csv)
  // }, [csv]);
  // console.log('cgPoint', cgPoint)
  return (
    <Box>
      {convergencePoints.length > 0 ? (
        <>
          <Box display='flex' justifyContent='flex-end'>
            <CSVLink data={csv} filename='strateegia_convergence_points_report-csv.csv'>
              <Button
                size='xs'
                fontSize='14px'
                fontWeight='400'
                bg='#6c757d' 
                color='#fff'
                borderRadius='3px'
                _hover={{bg: '#5C636A'}}
                paddingBottom={'4px'}
              >
                csv
              </Button>
            <Button
              m='2px'
              size='xs'
              fontSize='14px'
              fontWeight='400'
              bg='#6c757d' 
              color='#fff'
              borderRadius='3px'
              _hover={{bg: '#5C636A'}}
              paddingBottom={'4px'}
              onClick={() => exportJSONData(csv)}
            >
              json
            </Button>
            </CSVLink>
          </Box>
          {convergencePoints.map(convergencePoint =>
            convergencePoint.questions.map(question => (
              <Box margin={10}>
                <strong key={question.id}>{question.text}</strong>
                <UnorderedList margin={5}>
                  {question.options.map(option => (
                    <ListItem key={option.id}>
                      {option.text}: {(option.average * 100).toFixed(2)}%
                    </ListItem>
                  ))}
                </UnorderedList>
              </Box>
            ))
          )}

        </>
      ) : (
        <p>sem pontos de convergência</p>
      )}
    </Box>
  );
}

export const exportJSONData = (data) => {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(data)
  )}`;

  const link = document.createElement("a");
  link.href = jsonString;
  link.download = "strateegia_convergence_points_report-json.json";

  link.click();
}
