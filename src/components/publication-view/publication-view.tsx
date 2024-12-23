import { FC } from "react";
import classNames from "classnames";
import { Publication } from "../../types";

interface Props {
  publication: Publication;
}

const renderStatus = (status?: string) => (
  <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
    {status ?? "N/A"}
  </span>
);

const renderCategory = (category?: string) => (
  <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
    {category ?? "N/A"}
  </span>
);

const PublicationView: FC<Props> = ({ publication }) => {
  return (
    <div className="flex flex-col  space-y-4 rounded">
      <span className="text-gray-500 font-bold">{publication.name}:</span>
      <div
        className={classNames(
          "grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 border-l-8 border shadow-xl rounded-lg p-3 text-sm"
        )}
        data-testid={`row-${publication.id}`}
      >
        <div>
          <span className="font-semibold">Name:</span> {publication.name}
        </div>
        <div>
          <span className="font-semibold">Identifier:</span>{" "}
          {publication.identifier}
        </div>
        <div>
          <span className="font-semibold">UID:</span> {publication.uid}
        </div>
        <div>
          <span className="font-semibold">Visible:</span>{" "}
          {publication.is_visible.toString()}
        </div>
        <div>
          <span className="font-semibold">Status:</span>{" "}
          {renderStatus(publication.status)}
        </div>
        <div>
          <span className="font-semibold">Category:</span>{" "}
          {renderCategory(publication.category)}
        </div>
        <div>
          <span className="font-semibold">Created:</span>{" "}
          {publication.created_on || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Modified:</span>{" "}
          {publication.modified_on || "N/A"}
        </div>
      </div>
      <div>
        <span className="text-gray-500 font-bold">Links:</span>
        <ul className="list-disc gap-4 p-4">
          {Object.keys(publication?._links).map((linkName: string) => {
            const href = publication._links[linkName].href;
            return (
              <li key={linkName} className="text-gray-500">
                <a rel="noreferrer noopener" target="_blank" href={href}>
                  {linkName}
                  <span className="hidden sm:inline">: {href}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PublicationView;
