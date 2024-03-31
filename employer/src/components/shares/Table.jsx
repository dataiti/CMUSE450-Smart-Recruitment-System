const Table = ({ tableColumns = [], data }) => {
  return (
    <table className="w-full text-sm font-bold text-left cursor-pointer border border-blue-gray-100 !rounded-md">
      <thead className="text-xs text-[#212f3f] bg-blue-gray-100 uppercase border-b border-blue-gray-100">
        <tr>
          {tableColumns.map(({ id, name }) => (
            <th key={id} scope="col" className="px-6 py-3 text-xs text-center">
              {name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.length > 0 &&
          data.map((item, index) => (
            <tr
              className="bg-white border-b border-blue-gray-100 hover:bg-gray-100"
              key={index}
            >
              {tableColumns.map(({ id, render }) => (
                <td
                  key={id}
                  className="px-2 py-1 text-xs font-bold text-blue-gray-800"
                >
                  {render(item)}
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default Table;
