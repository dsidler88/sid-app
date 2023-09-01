"use client";

import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { deleteProject, fetchToken } from "@/lib/actions";
import { useRouter } from "next/navigation";

const ProjectActions = ({ projectId }: { projectId: string }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  //usefull flow here, set the state to true, then try to delete while it's true, then set to false
  const handleDeleteProject = async () => {
    setIsDeleting(true);
    //must get token because CUD operations require security
    const { token } = await fetchToken();
    try {
      await deleteProject(projectId, token);
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };
  //handleDeleteProject is passed to onClick as a callback, so no need to call(). native react functionality
  return (
    <>
      <Link
        className="flexCenter edit-action_btn"
        href={`/edit-project/${projectId}`}
      >
        <Image src="/pencile.svg" width={15} height={15} alt="edit" />
      </Link>
      <button
        className={`flexCenter delete-action_btn ${
          isDeleting ? "bg-gray" : "bg-primary-purple"
        }`}
        onClick={handleDeleteProject}
        type="button"
      >
        <Image src="/trash.svg" width={15} height={15} alt="delete" />
      </button>
    </>
  );
};

export default ProjectActions;
