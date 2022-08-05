import React, { Fragment } from "react";
import { Heading, Table, Thead, Tbody, Tr, Td, Checkbox, Box } from "@chakra-ui/react";
import { i18n } from "../translate/i18n";
import { gatherData } from "../data/graphData";
import { StatisticsTable } from "./StatisticsTable";
import { mean, stdev } from "stats-lite";
import { THeader } from "./THeader";
import { ExportsButtons } from "../components/ExportsButtons";
import { generateDocument } from "../components/FileContent";
import { sortString } from "../hooks/useSortString";
import Loading from "../components/Loading";

const UserTable = ({
  accessToken,
  selectedProject,
  selectedMap,
  selectedDivPoint,
  isLoading
}) => {
  const [commentsReport, setCommentsReport] = React.useState(null);
  const [selectedUsers, setSelectedUsers] = React.useState(null);
  const [reportLists, setReportLists] = React.useState(null);
  const [combinedCsv, setCombinedCsv] = React.useState('');

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response2 = await gatherData(
          accessToken,
          selectedProject,
          selectedMap,
          selectedDivPoint
        );
        setCommentsReport(response2);
      } catch (error) {
        console.log(error);
      }
    }
    selectedDivPoint && fetchData();
  }, [selectedDivPoint]);

  React.useEffect(() => {
    const selectUsers = commentsReport !== null ? [...commentsReport] : null
    selectUsers?.sort((a, b) => sortString(a["name"], b["name"]))
    setSelectedUsers(selectUsers);  
  }, [commentsReport]);

  React.useEffect(() => {
    const filteredUsers = selectedUsers ? selectedUsers.filter(user => user !== undefined && user !== 'empty') : commentsReport
    if (filteredUsers) {
      const commentsList = filteredUsers.map((d) => d.comments || 0);
      const repliesList = filteredUsers.map((d) => d.answers || 0);
      const commentsListMean = mean(commentsList);
      const commentsListStDev = stdev(commentsList);
      const commentsListEquilibriumIndex =
        (1 - commentsListStDev / commentsListMean) * 100;
      const repliesListMean = mean(repliesList);
      const repliesListStDev = stdev(repliesList);
      const repliesListEquilibriumIndex =
        (1 - repliesListStDev / repliesListMean) * 100;
      const totalEquilibriumIndex =
        (commentsListEquilibriumIndex + repliesListEquilibriumIndex) / 2;
      const outputLists = {
        commentsListMean,
        commentsListStDev,
        commentsListEquilibriumIndex,
        repliesListMean,
        repliesListStDev,
        repliesListEquilibriumIndex,
        totalEquilibriumIndex,
      };
      setReportLists({ ...outputLists });
    } else {
      setReportLists(null);
    }
  }, [selectedUsers]);
  
  return (
    <Fragment>
      <ExportsButtons 
        users={selectedUsers ? selectedUsers : ''} 
        stats={reportLists ? [reportLists] : ''} 
        rawData={{"statistics data" : reportLists , "users data" : selectedUsers}} 
        saveFile={() => generateDocument(selectedUsers, reportLists)} 
        project={selectedUsers}
      />
      <Loading active={isLoading} />
      <Heading as="h3" size="lg" mb={12} mt={3}>
        {i18n.t('main.heading')}
      </Heading>
      {selectedUsers && (
        <Table variant="striped" w="60vw" >
          <StatisticsTable reportLists={reportLists} />
          <br></br>
          <Thead >
            <Tr textTransform="lowercase" >
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
                        display='flex'
                      >
                        <Checkbox 
                          marginRight={3}
                          key={comment.id}
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


