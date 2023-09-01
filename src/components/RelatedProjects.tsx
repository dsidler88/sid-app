import { getUserProjects } from "@/lib/actions";
import React from "react";
import { ProjectInterface, UserProfile } from "../../common.types";
import Link from "next/link";
import Image from "next/image";

type RelatedProjectsProps = {
  userId: string;
  projectId: string;
};
const RelatedProjects = async ({ userId, projectId }: RelatedProjectsProps) => {
  //get projects that belong to this user

  const result = (await getUserProjects(userId)) as { user?: UserProfile };

  //must look at the UserProfile type and see where the projects are
  //get all projects that are not the current project
  const filteredProjects = result?.user?.projects?.edges?.filter(
    ({ node }: { node: ProjectInterface }) => node?.id !== projectId
  );

  console.log(filteredProjects);
  if (filteredProjects?.length === 0) return <p>No related projects</p>;
  return (
    <section className="flex flex-col mt-32 w-full">
      <div className="flexBetween">
        <p className="text-base font-bold">More By {result?.user?.name}</p>
        <Link
          className="text-primary-purple text-base"
          href={`/profile/${userId}`}
        >
          View All
        </Link>
      </div>
      <div className="related_projects-grid">
        {filteredProjects?.map(({ node }: { node: ProjectInterface }) => (
          <div className="flexCenter related_project-card drop-shadow-card">
            <Link
              href={`/project/${node?.id}`}
              className="flexCenter group relative w-full h-full"
            >
              <Image
                src={node?.image}
                width={414}
                height={314}
                className="w-full h-full object-cover rounded-2xl"
                alt="project image"
              />
              <div className="hidden group-hover:flex related_project-card_title">
                <p className="w-full">{node?.title}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProjects;
