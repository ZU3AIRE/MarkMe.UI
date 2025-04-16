interface Props {
  records: Array<{
    faceId: string;
    timestamp: Date;
    type: "check-in" | "check-out";
  }>;
}

export default function AttendanceList({ records }: Props) {
  return (
    <div>
      <h2>Attendance Records</h2>
      <div className="overflow-x-auto shadow-md rounded-lg"></div>
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
              Face ID
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
              Time
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
              Event
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {records.map((record, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 transition-colors duration-200">
              <td className="px-6 py-4 text-sm text-gray-800">
                {record.faceId}
              </td>
              <td className="px-6 py-4 text-sm text-gray-800">
                {record.timestamp.toLocaleTimeString()}
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-2 py-1 rounded-full ${
                    record.type === "check-in"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                  {record.type}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
