export const fetchDataHandler = ({task: {bitrix_id: taskId, title},
    employee_id: {bitrix_id: emplId, full_name: fullName}, pk, completed, comments}) => {
        return {
            taskId, title,
            emplId, fullName,
            pk, completed, comments
        }
}
