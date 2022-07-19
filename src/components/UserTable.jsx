import React, { Fragment } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Checkbox } from "@chakra-ui/react";
import { i18n } from "../translate/i18n";
import { gatherData } from "../data/graphData";
import { StatisticsTable } from "./StatisticsTable";
import { THeader } from "./THeader";


const UserTable = ({
  accessToken,
  selectedProject,
  selectedMap,
  selectedDivPoint,
}) => {
  const [commentsReport, setCommentsReport] = React.useState(null);
  const [selectedUsers, setSelectedUsers] = React.useState(null)
  const [truee, setTruee] = React.useState(true);
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
  }, [selectedDivPoint]);

  React.useEffect(() => {
    const oi = commentsReport !== null ? [...commentsReport] : null
    setSelectedUsers(oi);  
  }, [commentsReport]);
  
  return (
    <Fragment>
      {selectedUsers && (
        <Table variant="striped" w="60vw">
          <StatisticsTable commentsReport={selectedUsers ? selectedUsers : commentsReport} />
          <Thead>
            <Tr textTransform="lowercase">
              {/* <THeader maxWidth='sm' alignment='center'/> */}
              <THeader alignment="left" />
              <THeader width={"120px"} text={i18n.t("userTable.th2")} />
              <THeader text={i18n.t("userTable.th3")} />
              <THeader text={i18n.t("userTable.th4")} />
            </Tr>
          </Thead>
          <Tbody>
            {commentsReport
              ?.sort((a, b) => sortString(a["name"], b["name"]))
              .map((comment, i) => {
                return (
                  <>
                    <Tr key={i}>
                      <Td
                        key={comment.name} 
                        textTransform="lowercase" 
                        display='flex'>
                        
                        <Checkbox marginRight={3}
                          isChecked={selectedUsers[i] ? true : false}
                          onChange={() => {
                            const users = [...selectedUsers]
                            if(selectedUsers[i]) {
                              delete users[i]
                              setSelectedUsers(users)
                            } else {
                              users[i] = {...commentsReport[i]}
                              setSelectedUsers(users)
                            }
                          }}
                        />

                        {comment.name}
                      </Td>
                      <Td key={comment.name + comment.comments} textAlign="center">
                        {comment.comments || 0}
                      </Td>
                      <Td key={comment.answers + comment.name} textAlign="center">
                        {comment.answers || 0}
                      </Td>
                      <Td
                        key={comment.name + comment.agreements + comment.user}
                        textAlign="center"
                      >
                        {comment.agreements || 0}
                      </Td>
                    </Tr>
                  </>
                );
              })}
          </Tbody>
        </Table>
      )
        
      }
    </Fragment>
  );
};

export default UserTable;

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
