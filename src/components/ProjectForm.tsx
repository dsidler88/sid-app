"use client";

import React, { useEffect, useState } from "react";
import { ProjectInterface, SessionInterface } from "../../common.types";
import Image from "next/image";
import FormField from "./FormField";
import { categoryFilters } from "@/constants";
import CustomMenu from "./CustomMenu";
import Button from "./Button";
import {
  createNewProject,
  fetchTestData,
  fetchToken,
  updateProject,
} from "@/lib/actions";
import { useRouter } from "next/navigation";

//we created sessionInterface
// you know what to pass, then you know the type, and define it here
type Props = {
  type: string;
  session: SessionInterface;
  project?: ProjectInterface;
};

//we will have different types of forms, pass type as prop
const ProjectForm = ({ type, session, project }: Props) => {
  const router = useRouter();

  const [testData, setTestData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTestData();
      setTestData(data);
    };

    fetchData();
  }, []);

  //handles the db graphql mutation
  const handleFormSubmit = async (e: React.FormEvent) => {
    //in a nextjs app we can do this to prevent reload, make it feel quicker
    e.preventDefault();
    setIsSubmitting(true);

    const { token } = await fetchToken();
    console.log("HERES TEH TOKEN FROM IN THE COMPONENT");
    console.log(token);
    try {
      if (type === "create") {
        //create project action from actions
        console.log(form);
        await createNewProject(form, session?.user?.id, token);
        //console.log(project);
        router.push("/");
      }
      //should be treated as a string even if it is undefined
      if (type === "edit") {
        await updateProject(form, project?.id as string, token);
        router.push("/");
      }
    } catch (error) {
      console.log("error creating project!");
      console.log(error);
    }
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.includes("image")) {
      //alert is built in
      return alert("Please upload an image file");
    }

    //reads contents of a file
    const reader = new FileReader();

    //pass our file to the reader
    reader.readAsDataURL(file);

    //get the results as a string
    reader.onload = () => {
      const result = reader.result as string;
      //handle thte state change with the result, update the image
      handleStateChange("image", result);
      //later we will take this image and upload it to cloudinary
    };
  };

  //since we update forms based on their previous state, we use a function
  const handleStateChange = (fieldName: string, value: string) => {
    setForm((prevState) => ({ ...prevState, [fieldName]: value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  //create state for each field
  const [form, setForm] = useState({
    title: project?.title || "",
    description: project?.description || "",
    image: project?.image || "",
    liveSiteUrl: project?.liveSiteUrl || "",
    githubUrl: project?.githubUrl || "",
    category: project?.category || "",
  });

  return (
    <form className="flexStart form" onSubmit={handleFormSubmit}>
      <div className="flexStart form_image-container">
        <label htmlFor="poster" className="flexCenter form_image-label">
          {!form.image && "choose an image for upload"}
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          required={type === "create"}
          className="form_image-input"
          onChange={handleChangeImage}
        />
        {/* if there is an image, show it */}
        {form.image && (
          <Image
            src={form?.image}
            className="sm:p-10 object-contain z-20"
            alt="Project Poster"
            fill
          />
        )}
      </div>

      {/* fields */}
      <FormField
        title="Title"
        state={form.title}
        placeholder="Sid app"
        setState={(value) => handleStateChange("title", value)}
      />
      <FormField
        title="Description"
        state={form.description}
        placeholder="Upload and discovery of test cases"
        setState={(value) => handleStateChange("description", value)}
      />
      <FormField
        title="Website Url"
        state={form.liveSiteUrl}
        placeholder="https://idk.random.site.asoidu"
        setState={(value) => handleStateChange("liveSiteUrl", value)}
      />
      <FormField
        title="Github URL"
        state={form.githubUrl}
        placeholder="https://github.com/dsidler88"
        setState={(value) => handleStateChange("githubUrl", value)}
      />

      {/* custom input category */}

      <CustomMenu
        title="Category"
        state={form.category}
        filters={categoryFilters}
        setState={(value) => handleStateChange("category", value)}
      />
      <div className="flexStart w-full">
        {/* if we're submitting, check if creating & createing or editing because isSub is true... but THEN
        hit the second ternary, if not submitting, check the type and display create or edit.
        quite simple, adds "ing" if it's in progress */}
        <Button
          title={
            isSubmitting
              ? `${type === "create" ? "Creating" : "Editing"}`
              : `${type === "create" ? "Create" : "Edit"}`
          }
          type="submit"
          leftIcon={isSubmitting ? "" : "/plus.svg"}
          submitting={isSubmitting}
        />
        <h1>HERE WE GO</h1>
        <h1>THIS: {JSON.stringify(testData)}</h1>
      </div>
    </form>
  );
};

export default ProjectForm;
