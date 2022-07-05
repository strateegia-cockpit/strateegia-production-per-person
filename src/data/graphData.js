import * as api from "strateegia-api";
import * as d3 from 'd3';

const gatherPoints = async (accessToken, projectId, mapId) => {
  const map = await Promise.all(
    mapId.map( async ({value}) => {
      const {points} = await api.getMapById(accessToken, value);
      return points;
    })
  )
  const project = await api.getProjectById(accessToken, projectId);
  return [map.flat(), project];
};

const getComments = async (accessToken, divPointId) => {
  const comments = await Promise.all(
    divPointId?.map( async ({value}) => {
      const data = await api.getCommentsGroupedByQuestionReport(accessToken, value);
      const getOnlyComments = await data.map(({comments}) => comments);
      return getOnlyComments.flat();
    })
  )
  return comments.flat();
};

const getCount = (arrayToReduce) => {
    const count = arrayToReduce.reduce((acc, {author} ) => {        
        return { ...acc, [author.id]: (acc[author.id] || 0) + 1}
    }, []);  
  return count;
};

export async function gatherData(accessToken, projectId, mapId, divPointId) {
  const data = await gatherPoints(accessToken, projectId, mapId);

  const comments = await getComments(accessToken, divPointId);
  
  const replies = comments.map(({ replies }) => {
    return replies;
  });
  const agreements = comments.map(({ agreements }) => {
    return agreements;
  });

  const usersCommentsCount = getCount(comments);
  const usersAnswersCount = getCount(replies.flat());
  const usersAgreementsCount = agreements.flat().reduce((acc, {user_id}) => {        
    return { ...acc, [user_id]: (acc[user_id] || 0) + 1 }
  }, []);  
  
  const users = data[1].users.map(({name, id}) => {
    return {name: name, id: id}
  });

  const usersForUserTable = users.map(user => {
      return [{...user, 'comments': usersCommentsCount[user['id']] || 0, 'answers': usersAnswersCount[user['id']] || 0, 'agreements': usersAgreementsCount[user['id']] || 0 }];
  });

  return usersForUserTable.flat();
}

export async function gatherGraphData(accessToken, projectId, mode) {

  const cData = {
    nodes: [],
    links: []
  };

  // const fData = {};

  // let filters = {};

  // if (mode === "usuário") {
  //   filters = {
  //     group: group => ["comment", "reply", "agreement", "users", "user"].includes(group),
  //     // group: group => ["project", "map", "kit", "question", "comment", "reply", "agreement", "users", "user"].includes(group),
  //   };
  // } else if (mode === "projeto") {
  //   filters = {
  //     // group: group => ["comment", "reply", "agreement", "users", "user"].includes(group),
  //     group: group => ["project", "map", "kit", "question", "comment", "reply", "agreement"].includes(group),
  //   };
  // } else if (mode === "indicadores") {
  //   filters = {
  //     group: group => ["project", "map", "kit", "question", "comment", "reply", "agreement", "users", "user"].includes(group),
  //   };
  // }

  function mapColorAndSize(group) {
    const groups = ["project", "map", "divpoint", "question", "comment", "reply", "agreement", "user", "users"];
    const colors = ["#023a78", "#0b522e", "#ff8000", "#974da2", "#e51d1d", "#377eb8", "#4eaf49", "#636c77", "#b2b7bd"];
    // const sizes = [10, 9, 8, 7, 6, 4, 3, 7, 9];
    const sizes = [100, 50, 8, 7, 6, 4, 3, 7, 9];
    const color = d3.scaleOrdinal()
      .domain(groups)
      .range(colors);
    const size = d3.scaleOrdinal()
      .domain(groups)
      .range(sizes);
    return { color: color(group), size: size(group) };
  }

  function addNode(id, title, group, createdAt, dashboardUrl) {
    const date = new Date(createdAt)
    const configs = mapColorAndSize(group);
    cData.nodes.push({
      "id": id,
      "title": title,
      "group": group,
      "createdAt": date,
      "dashboardUrl": dashboardUrl,
      "color": configs.color,
      "size": configs.size
    });
  }

  function addLink(source, target) {
    // console.log("addLink %o %o", source, target);
    const targetNode = cData.nodes.find(x => x.id === target);
    if (targetNode !== undefined) {
      targetNode.parentId = source;
    }
    const newLink = {
      "source": source,
      "target": target
    };
    cData.links.push(newLink);
  }

  const project = await api.getProjectById(accessToken, projectId);
  if (project.maps.length > 1) {
    const dashboardUrl = `https://app.strateegia.digital/journey/${projectId}`;
    addNode(projectId, project.title, "project", project.created_at, dashboardUrl);
  }

  addNode("users", "Usuários", "users", project.created_at);
  project.users.forEach(user => {
    addNode(user.id, user.name, "user", project.created_at);
    addLink("users", user.id);
  });

  const mapRequests = [];
  project.maps.forEach(map => {
    const mapId = map.id;
    mapRequests.push(api.getMapById(accessToken, mapId));
  });

  const mapRequestsResult = await Promise.all(mapRequests);
  const allDivPointRequests = [];
  mapRequestsResult.forEach(map => {
    const mapId = map.id;
    const mapTitle = map.title;
    const mapCreatedAt = map.created_at;
    const mapDashboardUrl = `https://app.strateegia.digital/journey/${projectId}/map/${mapId}`;
    addNode(mapId, mapTitle, "map", mapCreatedAt, mapDashboardUrl);
    if (project.maps.length > 1) {
      addLink(projectId, mapId);
    }
    allDivPointRequests.push(api.getAllDivergencePointsByMapId(accessToken, mapId));
  });

  const allDivPointRequestsResult = await Promise.all(allDivPointRequests);
  const allCommentsRequests = [];
  allDivPointRequestsResult.forEach(mapWithDivPoints => {
    mapWithDivPoints.content.forEach(divPoint => {
      const divPointId = divPoint.id;
      const divPointTitle = divPoint.tool.title;
      const divPointCreatedAt = divPoint.created_at;
      const divPointDashboardUrl = `https://app.strateegia.digital/journey/${projectId}/map/${divPoint.map_id}/point/${divPointId}`;
      addNode(divPointId, divPointTitle, "divpoint", divPointCreatedAt, divPointDashboardUrl);
      addLink(divPoint.map_id, divPointId);
      const questions = divPoint.tool.questions;
      questions.forEach(question => {
        const questionId = question.id;
        const questionIdForGraph = `${divPointId}#${questionId}`;
        const questionText = question.question;
        const questionCreatedAt = divPointCreatedAt;
        const questionDashboardUrl = divPointDashboardUrl;
        addNode(questionIdForGraph, questionText, "question", questionCreatedAt, questionDashboardUrl);
        addLink(divPointId, questionIdForGraph);
      });
      allCommentsRequests.push(api.getCommentsGroupedByQuestionReport(accessToken, divPointId));
    });
  });

  const allCommentsRequestsResult = await Promise.all(allCommentsRequests);
  allCommentsRequestsResult.forEach(report => {
    report.forEach(question => {
      question.comments.forEach(comment => {
        const commentId = comment.id;
        const commentText = comment.text;
        const commentCreatedAt = comment.created_at;
        const commentCreatedBy = comment.created_by;
        const questionIdForGraph = `${comment.divergence_point_id}#${comment.question_id}`;
        addNode(commentId, commentText, "comment", commentCreatedAt, null);
        if (mode === "projeto") {
          addLink(questionIdForGraph, commentId);
        } else {
          addLink(commentCreatedBy, commentId); // USER
        }
        const replies = comment.replies;
        replies.forEach(reply => {
          const replyId = reply.id;
          const replyText = reply.text;
          const replyCreatedAt = reply.created_at;
          const replyCreatedBy = reply.created_by;
          addNode(replyId, replyText, "reply", replyCreatedAt, null);
          if (mode === "projeto") {
            addLink(commentId, replyId);
          } else {
            addLink(replyCreatedBy, replyId); // USER
          }
          reply.agreements.forEach((agreement, index) => {
            const agreementId = `${replyId}#${index}`;
            const agreementText = "OK";
            const agreementCreatedAt = agreement.created_at;
            const agreementCreatedBy = agreement.user_id;
            addNode(agreementId, agreementText, "agreement", agreementCreatedAt, null);
            if (mode === "projeto") {
              addLink(replyId, agreementId);
            } else {
              addLink(agreementCreatedBy, agreementId); // USER
            }
          });
        });
        const agreements = comment.agreements;
        agreements.forEach((agreement, index) => {
          // console.log("about agreement %o", agreement)
          const agreementId = `${commentId}#${index}`;
          const agreementText = "OK";
          const agreementCreatedAt = agreement.created_at;
          const agreementCreatedBy = agreement.user_id;
          addNode(agreementId, agreementText, "agreement", agreementCreatedAt, null);
          if (mode === "projeto") {
            addLink(commentId, agreementId);
          } else {
            addLink(agreementCreatedBy, agreementId); // USER
          }
        });
      });
    });
  });
  // console.log(cData);
  return cData;
}

export async function extractUserCommentInfo(accessToken, projectId = undefined, mapId = undefined, divPoint = undefined ) {
  
  const cData = await gatherGraphData(accessToken, projectId, "usuário");
  // console.log("🚀 ~ file: graphData.js ~ line 192 ~ extractUserCommentInfo ~ cData", cData)
  const fullLinks = cData.links.map(link => {
    return {
      source: cData.nodes.find(node => node.id === link.source),
      target: cData.nodes.find(node => node.id === link.target)
    }
  });
  // console.log("🚀 ~ file: graphData.js ~ line 199 ~ extractUserCommentInfo ~ fullLinks", fullLinks)
  // console.log("fullLinks %o", fullLinks);
  const onlyUsers = fullLinks.filter(item => item?.source?.group === 'user');
  // console.log("onlyUsers %o", onlyUsers);
  const limpando = onlyUsers.map(item => { return `${item.source.title},${item.target.group},${item.target.title}` });
  // console.log("limpando %o", limpando);
  // limpando.forEach(d => console.log(d));
  const output = limpando.map(item => { return { user: item.split(',')[0], action: item.split(',')[1] } });
  const auxCounter = d3.group(output, d => d.user, d => d.action);
  // console.log("auxCounter %o", auxCounter);
  const rollup = d3.rollup(output, v => v.length, d => d.user, d => d.action);
  const counter = Array.from(rollup, ([key, values]) => {
    return {
      user: key,
      comments: values.get("comment"),
      replies: values.get("reply"),
      agreements: values.get("agreement")
    }
  });
  // console.log("counter %o", counter);
  // console.log("rollup %o", rollup);
  return { raw: limpando, counter: counter };
}