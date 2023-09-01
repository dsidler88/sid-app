//very useful actions. Always have something like this

import { GraphQLClient } from "graphql-request";
import axios from "axios";
import {
  createProjectMutation,
  createUserMutation,
  deleteProjectMutation,
  updateProjectMutation,
  getProjectByIdQuery,
  getProjectsOfUserQuery,
  getUserQuery,
  projectsQuery,
} from "../graphql";
import { ProjectForm } from "../../common.types";
import { is } from "date-fns/locale";
//import { HttpsProxyAgent } from "https-proxy-agent";

//const agent = new HttpsProxyAgent("http://evapzen.fpl.com:10262");

const isProduction = process.env.NODE_ENV === "production";

const apiURL = isProduction
  ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || ""
  : "http://127.0.0.1:4000/graphql";

const apiKey = isProduction
  ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || ""
  : "letmein";

//production or nah
const serverURL = isProduction
  ? process.env.NEXT_PUBLIC_SERVER_URL
  : "http://localhost:3000";

const client = new GraphQLClient(apiURL);

const makeGraphQLRequest = async (query: string, variables = {}) => {
  try {
    //client.request
    return await client.request(query, variables);
  } catch (error) {
    throw error;
  }
};

export const getUser = (email: string) => {
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getUserQuery, { email });
};

export const createUser = (name: string, email: string, avatarUrl: string) => {
  client.setHeader("x-api-key", apiKey);
  const variables = {
    input: {
      name,
      email,
      avatarUrl,
    },
  };
  return makeGraphQLRequest(createUserMutation, variables);
};

// export const fetchToken = async () => {
//   try {
//     //this endpoint does not automatically exist, we made it.
//     //it returns the token
//     const response = await fetch(`${serverURL}/api/auth/token`);
//     //const response = await axios.get(`${serverURL}/api/auth/token`);
//     console.log("here is the token from fetchToken");
//     console.log(response);
//     //json for fetch, data for axios
//     return response.json();
//     //return response.data;
//   } catch (error) {
//     console.log("FETCH TOKEN ERROR", error);
//     throw error;
//   }
// };
export const fetchToken = async () => {
  try {
    const response = await fetch(`${serverURL}/api/auth/token`);
    return response.json();
  } catch (err) {
    throw err;
  }
};

//util function for test data
export const fetchTestData = async () => {
  try {
    const response = await fetch(`${serverURL}/api/test`, {
      method: "GET",
    });
    return response.json();
  } catch (error) {
    console.log("there was an error", error);
  }
};

//util function for uploading Image
export const uploadImage = async (imagePath: string) => {
  //console.log("here is the image path");
  //console.log(imagePath);
  try {
    const response = await fetch(`${serverURL}/api/upload`, {
      method: "POST",
      body: JSON.stringify({ path: imagePath }),
    });

    //returns cloudinary url
    return response.json();
  } catch (error) {}
};

//we made this type. token is needed to authenticate
export const createNewProject = async (
  form: ProjectForm,
  creatorId: string,
  token: string
) => {
  const imageUrl = await uploadImage(form.image);

  if (imageUrl.url) {
    client.setHeader("Authorization", `Bearer ${token}`);

    const variables = {
      input: {
        ...form,
        image: imageUrl.url,
        createdBy: {
          link: creatorId,
        },
      },
    };

    return makeGraphQLRequest(createProjectMutation, variables);
  }
};

//endcursor will let us know which page we're on
export const fetchAllProjects = (category?: string, endcursor?: string) => {
  client.setHeader("x-api-key", apiKey);

  // Set default category if undefined. remove this later
  if (category === undefined) {
    category = "Mobile";
  }

  return makeGraphQLRequest(projectsQuery, {
    category,
    endcursor,
  });
};

export const getProjectDetails = (id: string) => {
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getProjectByIdQuery, { id });
};

//last is how many we want to get
export const getUserProjects = (id: string, last?: number) => {
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getProjectsOfUserQuery, { id, last });
};

//last is how many we want to get
export const deleteProject = (id: string, token: string) => {
  //this is a secure action so token must be in header
  //i guess if it has the token, then it doesn't need the API key header
  client.setHeader("Authorization", `Bearer ${token}`);
  return makeGraphQLRequest(deleteProjectMutation, { id });
};

export const updateProject = async (
  form: ProjectForm,
  projectId: string,
  token: string
) => {
  //check if user has redeployed new image, or kept same one
  //if they did, new upload. so if it's a base64 image, it's a new upload, if it's cloudinary then it's the same
  function isBase64DataUrl(str: string): boolean {
    const regex = /^data:(.*?);base64,(.*)$/;
    return regex.test(str);
  }

  let updatedForm = { ...form };

  const isUpoadingNewImage = isBase64DataUrl(form.image);

  if (isUpoadingNewImage) {
    const imageUrl = await uploadImage(form.image);
    if (imageUrl.url) {
      updatedForm = {
        ...form,
        image: imageUrl.url,
      };
    }
    if (imageUrl.url) {
      updatedForm.image = imageUrl.url;
    }
  }

  const variables = {
    id: projectId,
    input: updatedForm,
  };

  //this is a secure action so token must be in header
  //i guess if it has the token, then it doesn't need the API key header
  client.setHeader("Authorization", `Bearer ${token}`);
  return makeGraphQLRequest(updateProjectMutation, variables);
};
