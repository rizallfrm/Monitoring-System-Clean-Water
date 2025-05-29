export function DataTable({ columns, data, actions }) {
  return (
    <div className="flex justify-center items-center bg-white rounded-xl shadow w-[1104px] max-md:overflow-x-auto max-md:w-full">
      <table className="border-collapse w-[1104px] max-md:min-w-[800px]">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-5 pt-3.5 pb-3.5 text-sm font-semibold text-left text-gray-800"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={`p-5 text-sm text-gray-800 ${
                    rowIndex === 0 ? '' : 'border-t border-solid border-t-gray-100'
                  }`}
                >
                  {column.key === 'actions' && actions
                    ? actions(row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default DataTable;
