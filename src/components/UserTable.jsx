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
import { extractUserCommentInfo } from "../data/graphData"; 

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

const UserTable = ({accessToken, selectedProject}) => {
    const [commentsReport, setCommentsReport] = React.useState(null);
    const [rawData, setRawData] = React.useState(null);

    React.useEffect(() => {
        async function fetchData() {
        //   setIsLoading(true);
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
        //   setIsLoading(false);
        }
        fetchData();
      }, [selectedProject]);
   

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
            {commentsReport?.counter
                  .sort((a, b) => sortString(a.user, b.user))
                  .map((comment, i) => {
                    return (
                    <Tr key={comment.user}>
                        <Td key={comment.user+i} textTransform='lowercase'> 
                            {comment.user}
                        </Td>
                        <Td key={comment.comments} textAlign='center'>{comment.comments || 0}</Td>
                        <Td key={comment.replies} textAlign='center'>{comment.replies || 0}</Td>
                        <Td key={comment.agreements} textAlign='center'>{comment.agreements || 0}</Td>
                    </Tr>
                );
            })}
            
            </Tbody>
        </Table>
    )
}

export default UserTable;