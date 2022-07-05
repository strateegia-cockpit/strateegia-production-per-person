import React from "react";
import { 
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td, 
} from '@chakra-ui/react';
import { i18n } from "../translate/i18n";
import { gatherData } from "../data/graphData"; 

export const THeader = ({text, weight, alignment, width}) => {
    return (
        <Th 
            textTransform='lowercase'
            textAlign={alignment || 'center'}
            fontWeight={weight || 500}
            className='biggerTh'
            fontFamily='Montserrat, sans-serif'
            fontSize={16}
            minW={width || 'auto' }
        >
            {text || ''}
        </Th>
    )
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

const UserTable = ({accessToken, selectedProject, selectedMap, selectedDivPoint}) => {
    const [commentsReport, setCommentsReport] = React.useState(null);
    const [rawData, setRawData] = React.useState(null);

    React.useEffect(() => {
        async function fetchData() {
        //   setIsLoading(true);
          try {
            const response2 = await gatherData(
              accessToken,
              selectedProject,
              selectedMap,
              selectedDivPoint
            );
            setCommentsReport(response2);
            // setRawData([...response2.raw.sort((a, b) => sortString(a, b))]);
          } catch (error) {
            console.log(error);
          }
        //   setIsLoading(false);
        }
        fetchData();
      }, [selectedMap, selectedDivPoint]);


    return (
        <Table variant='striped' w='60vw'>
            <Thead>
            <Tr textTransform='lowercase' >
                <THeader alignment='left'/>
                <THeader width={'120px'} text={i18n.t('userTable.th2')}/>
                <THeader text={i18n.t('userTable.th3')}/>
                <THeader text={i18n.t('userTable.th4')}/>
                
            </Tr>
            </Thead>
            <Tbody>
            {commentsReport?.sort((a, b) => sortString(a['name'], b['name']))
                  .map((comment, i) => {
                    return (
                    <Tr key={i}>
                        <Td key={comment.name} textTransform='lowercase'> 
                            {comment.name}
                        </Td>
                        <Td key={comment.name+comment.comments} textAlign='center'>{comment.comments || 0}</Td>
                        <Td key={comment.replies+comment.name} textAlign='center'>{comment.replies || 0}</Td>
                        <Td key={comment.name+comment.agreements+comment.user} textAlign='center'>{comment.agreements || 0}</Td>
                    </Tr>
                );
            })}
            
            </Tbody>
        </Table>
    )
}

export default UserTable;