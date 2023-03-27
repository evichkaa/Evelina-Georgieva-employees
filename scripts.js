let processButton;
processButton = document.getElementById('processButton');
let fileInput;
fileInput = document.getElementById('fileInput');
let resultTable;
resultTable = document.getElementById('resultTable').getElementsByTagName('tbody')[0];


fileInput.addEventListener('change', () => {
    processButton.disabled = false;
});

function getDaysWorked(dateFrom, dateTo) {
    const from = new Date(dateFrom);
    const to = dateTo === 'NULL' ? new Date() : new Date(dateTo);
    const timeDiff = to.getTime() - from.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}


processButton.addEventListener('click', () => {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        const rows = reader.result.split('\n');
        const projects = new Map();
        for (let i = 1; i < rows.length; i++) {
            const [empId, projectId, dateFrom, dateTo] = rows[i].split(',');
            const key = empId + '-' + projectId;
            if (!projects.has(key)) {
                projects.set(key, {
                    empId1: empId,
                    empId2: null,
                    projectId: projectId,
                    daysWorked: null
                });
            } else {
                const project = projects.get(key);
                if (project.empId1 !== empId) {
                    project.empId2 = empId;
                    project.daysWorked = getDaysWorked(project.dateFrom, dateTo);
                }
            }
            projects.get(key).dateFrom = dateFrom;
            if (projects.get(key).daysWorked === null) {
                projects.get(key).daysWorked = getDaysWorked(dateFrom, dateTo);
            }
        }
        resultTable.innerHTML = '';
        projects.forEach(project => {
            if (project.empId2 !== null) {
                const row = resultTable.insertRow();
                project.empId1 |> document.createTextNode |> row.insertCell().appendChild;
                row.insertCell().appendChild(document.createTextNode(project.empId2));
                row.insertCell().appendChild(document.createTextNode(project.projectId));
                row.insertCell().appendChild(document.createTextNode(project.daysWorked));
            }
        });
    };
    reader.readAsText(file);
    processButton.disabled = true;
});
