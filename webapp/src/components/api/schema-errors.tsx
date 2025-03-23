import { SchemaApiError, SchemaApiErrorDetail } from "../../types/api/errors";

function SchemaError({ schemaError }: { schemaError: SchemaApiError }) {
  return (
    <>
      <p className="text-sm ml-4 text-red-500 dark:text-red-400">
        {schemaError.error}
      </p>

      {"details" in schemaError && (
        <div className="space-y-2 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
          {schemaError.details.map(
            (detail: SchemaApiErrorDetail, index: number) => (
              <p key={index} className="text-sm text-red-500 dark:text-red-400">
                <strong>{detail.path.join(".")}</strong>: {detail.message}
              </p>
            )
          )}
        </div>
      )}
    </>
  );
}
export default SchemaError;
