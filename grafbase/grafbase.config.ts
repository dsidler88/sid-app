import { g, auth, config } from "@grafbase/sdk";

//grafana is basically prisma for bums

//but it does include authentication

//create the model and the schema, passing an object of all user properties
const User = g.model("User", {
  name: g.string().length({
    min: 2,
    max: 20,
  }),
  email: g.string().unique(),
  avatarUrl: g.url(),
  description: g.string().optional().length({
    min: 2,
    max: 256,
  }),
  githubUrl: g.url().optional(),
  linkedInUrl: g.url().optional(),
  //relation must link to another model
  projects: g
    .relation(() => Project)
    .list()
    .optional(),
});

const Project = g.model("Project", {
  title: g.string().length({
    min: 2,
    max: 20,
  }),
  description: g.string().optional().length({
    min: 2,
    max: 256,
  }),
  image: g.url(),
  liveSiteURL: g.url(),
  githubURL: g.url().optional(),
  category: g.string().search(),
  createdBy: g.relation(() => User),
});

export default config({
  schema: g,
});

//once you create the models, grafbase creates queries and things for you.
