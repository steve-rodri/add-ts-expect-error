import React from "react"
import { useSelector } from "react-redux"
import { createMissedMeetingNotification } from "../../../api-client/apiModules/successCoach"
import OptionsCell from "../../../components/table/cells/OptionsCell"
import TableRow from "../../../components/table/TableRow"
import { StoreState } from "../../../redux/reducers"
import { routes } from "../../router/routes"
import StudentInfoCell from "./cells/SystemTrackingInfoCell"
import StudentNameCell from "./cells/SystemTrackingNameCell"
import { SystemTrackingTableRowInterface } from "./types"
import toast from "react-hot-toast"

interface SystemTrackingRowProps {
  rowData: SystemTrackingTableRowInterface
}
const SystemTrackingTableRow: React.FC<SystemTrackingRowProps> = ({
  rowData,
}) => {
  const ellipsisActions = []

  const user = useSelector((state: StoreState) => state.user)

  return (
    <TableRow>
      <StudentNameCell text={rowData.name} />
      <StudentInfoCell text={rowData.logins} />
      <StudentInfoCell text={rowData.lessonsCompleted} />
      <StudentInfoCell text={rowData.assignmentsCompleted} />
      <StudentInfoCell text={rowData.applications} />
      <StudentInfoCell text={rowData.interviews} />
      <StudentInfoCell text={rowData.tasks} />
      <StudentInfoCell text={rowData.resumeUploads} />
      <StudentInfoCell text={rowData.jobsPageVisitations} />
      <OptionsCell options={ellipsisActions} />
    </TableRow>
  )
}

export default SystemTrackingTableRow
