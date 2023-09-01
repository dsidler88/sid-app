import { g, auth, config } from "@grafbase/sdk";

//grafana is basically prisma for bums

//but it does include authentication

//create the model and the schema, passing an object of all user properties
//@ts-ignore
const User = g
  .model("User", {
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
  })
  .auth((rules) => {
    rules.public().read();
  });

//@ts-ignore
const Project = g
  .model("Project", {
    title: g.string().length({
      min: 2,
      max: 20,
    }),
    description: g.string().optional().length({
      min: 2,
      max: 256,
    }),
    image: g.url(),
    liveSiteUrl: g.url(),
    githubUrl: g.url().optional(),
    category: g.string().search(),
    createdBy: g.relation(() => User),
  })
  .auth((rules) => {
    rules.public().read(), rules.private().create().delete().update();
  }); //that means everyone can read, only private (users) can create, delete, update

//Next
const jwt = auth.JWT({
  issuer: "grafbase",
  secret: g.env("NEXTAUTH_SECRET"),
});

//different models can have different rules. add .rules to the models as callback
//so this config is GENERALLY set to "private"... but some models above have custom "public" rules
export default config({
  schema: g,
  auth: {
    providers: [jwt],
    rules: (rules) => rules.private(),
  },
});

//once you create the models, grafbase creates queries and things for you.
