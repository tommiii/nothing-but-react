import { FC } from "react";
import { useGetProjectsQuery } from "../api/hooks";
import Table from "../components/table";

const Dashboard: FC = () => {
  const { data: projects, error } = useGetProjectsQuery();

  console.log({ projects });

  const mappedData = projects?._embedded?.title?.map(
    ({ id, name, created_on, modified_on }) => ({
      id,
      name,
      created: created_on,
      modified: modified_on,
    })
  );

  if (error) {
    return <>Something went wrong loading the data. Try again</>;
  }

  return (
    <>
      <div className="flex flex-col p-5">
        <div className="text-gray-500 text-2xl">Foleon Dashboard</div>
        <Table hideColumns={["id"]} data={mappedData} />
      </div>
    </>
  );
};

export default Dashboard;
