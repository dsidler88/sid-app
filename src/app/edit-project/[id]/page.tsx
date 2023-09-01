import Modal from "@/components/Modal";
import ProjectForm from "@/components/ProjectForm";
import { getCurrentUser } from "@/lib/auth";
import { get } from "http";
import { redirect } from "next/navigation";
import React from "react";
import { ProjectInterface } from "../../../../common.types";
import { getProjectDetails } from "@/lib/actions";

const EditProject = async ({ params: { id } }: { params: { id: string } }) => {
  const session = await getCurrentUser();
  if (!session?.user) {
    redirect("/");
  }

  //returns it AS projectinterface type
  //id comes from PARAMS (the url)
  const result = (await getProjectDetails(id)) as {
    project?: ProjectInterface;
  };

  return (
    <Modal>
      <h3 className="modal-head-text">Edit Project</h3>
      <ProjectForm type="edit" session={session} project={result?.project} />
    </Modal>
  );
};

export default EditProject;
