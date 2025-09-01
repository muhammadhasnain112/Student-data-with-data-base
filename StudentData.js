// Toastr configuration
toastr.options = {
    "closeButton": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "3000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

const supabaseUrl = 'https://ipoviueuhflhqjemgfkw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlwb3ZpdWV1aGZsaHFqZW1nZmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mzc5NzEsImV4cCI6MjA2ODUxMzk3MX0.ACNfp4MRa7-r1YYmu04VDltBo5UudrKWWw2NyDPBrk0'
const client = supabase.createClient(supabaseUrl, supabaseKey)
const table = document.getElementById('table')
const th = document.getElementById('th')
const loader = document.getElementById('loader')
const maintable = document.getElementById('maintable')
const h1 = document.getElementById('h1')
const courseFilter = document.getElementById('courseFilter')
const statusFilter = document.getElementById('statusFilter')
const genderFilter = document.getElementById('genderfilter')
const allFilters = document.getElementById('allFilters')
const FilterRollNum = document.getElementById('FilterRollNum')
const FilterCnicNum = document.getElementById('FilterCnicNum')
const noData = document.getElementById('noData')

document.getElementById('back').addEventListener('click', () => allFilters.style.display = 'none')
document.getElementById('allFiltersbtn').addEventListener('click', () => allFilters.style.display = 'block')

let token = localStorage.getItem('authToken')
let allStudentsData = []; // Store all student data

// Initialize the page
if (token) {
    adminshowdata()
} else {
    showdata()
}

// Event listeners for filters
genderFilter.addEventListener('change', applyFilters)
courseFilter.addEventListener('change', applyFilters)
statusFilter.addEventListener('change', applyFilters)
FilterRollNum.addEventListener('input', applyFilters)
FilterCnicNum.addEventListener('input', applyFilters)

// Function to apply all filters
function applyFilters() {
    let filteredStudents = [...allStudentsData];

    // Apply gender filter if selected
    if (genderFilter.value && genderFilter.value !== "All") {
        filteredStudents = filteredStudents.filter(student => student.gender === genderFilter.value);
    }

    // Apply course filter if selected
    if (courseFilter.value && courseFilter.value !== "All") {
        const ITcourses = ['Web Development', 'Graphic Designing', 'Digital Marketing', 'Cyber Security'];
        const LanguageCourses = ['English', 'Chinese', 'Arabic'];

        if (courseFilter.value === "IT") {
            filteredStudents = filteredStudents.filter(student => ITcourses.includes(student.course));
        }
        else if (courseFilter.value === "Language") {
            filteredStudents = filteredStudents.filter(student => LanguageCourses.includes(student.course));
        }
        else {
            filteredStudents = filteredStudents.filter(student => student.course === courseFilter.value);
        }
    }

    // Apply status filter if selected
    if (statusFilter.value && statusFilter.value !== "All") {
        filteredStudents = filteredStudents.filter(student => student.status === statusFilter.value);
    }

    // Apply roll number search if entered
    const rollNumber = FilterRollNum.value;
    if (rollNumber) {
        filteredStudents = filteredStudents.filter(e => e.RollNumber.toString().includes(rollNumber));
    }

    // Apply CNIC search if entered
    const cnicValue = FilterCnicNum.value.replace(/-/g, '');
    if (cnicValue) {
        filteredStudents = filteredStudents.filter(e => e.cnic.replace(/-/g, '').includes(cnicValue));
    }

    // Display the filtered results
    showStudents(filteredStudents);
}

function formatCNIC(input) {
    let value = input.value.replace(/\D/g, "");
    if (value.length > 5 && value.length <= 12) {
        value = value.slice(0, 5) + "-" + value.slice(5);
    }
    if (value.length > 12) {
        value = value.slice(0, 5) + "-" + value.slice(5, 12) + "-" + value.slice(12, 13);
    }
    input.value = value;
    applyFilters(); // Apply filters as user types
}

function showStudents(students) {
    if (students.length === 0) {
        noData.style.display = 'block';
        table.style.display = 'none';
    } else {
        noData.style.display = 'none';
        table.style.display = 'table-row-group';

        if (token) {
            table.innerHTML = '';
            students.forEach(e => {
                adminshowdata1(e);
            });
        } else {
            table.innerHTML = '';
            students.forEach(e => {
                localusershowdata(e);
            });
        }
    }
}

async function showdata() {
    const { data, error } = await client
        .from('Students')
        .select('*');
    if (error) {
        alert(error.message);
    } else {
        allStudentsData = data; // Store all data
        applyFilters(); // Apply any existing filters
    }
}

function adminshowdata() {
    th.innerHTML += '<th>Actions</th>';
    document.getElementById('actionHeader').style.display = 'table-cell';
    showadmin();
}

async function showadmin() {
    const { data, error } = await client
        .from('Students')
        .select('*');
    if (error) {
        alert(error.message);
        return;
    } else {
        allStudentsData = data; // Store all data
        applyFilters(); // Apply any existing filters
    }
}

async function status(id) {
    const selectElement = document.querySelector(`select[onchange="status(${id})"]`);
    const newStatus = selectElement.value;

    const { data, error } = await client
        .from('Students')
        .update({ status: newStatus })
        .eq('id', id)
        .select();

    if (error) {
        alert(error.message);
    } else {
        toastr.success(`Student Status Changed to ${newStatus}`);
        // Update the local data
        const index = allStudentsData.findIndex(student => student.id === id);
        if (index !== -1) {
            allStudentsData[index].status = newStatus;
        }
        // Reapply filters
        applyFilters();
    }
}

async function dlt(id) {
    // Confirmation dialog
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
        const { data, error } = await client
            .from('Students')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            alert(error.message);
            return;
        } else {
            toastr.info(`Student Removed`);
            // Remove from local data
            allStudentsData = allStudentsData.filter(student => student.id !== id);
            // Reapply filters
            applyFilters();
            Swal.fire(
                'Deleted!',
                'Student record has been deleted.',
                'success'
            );
        }
    }
}

async function adminshowdata1(e) {
    table.innerHTML +=
        `<tr>
                    <td data-label="Image"><img src="${e.imgPath}" alt="${e.name}" width="40"></td>
                    <td data-label="Name">${e.name}</td>
                    <td data-label="Father Name">${e.fatherName}</td>
                    <td data-label="Mobile">${e.mobile}</td>
                    <td data-label="Age">${e.age}</td>
                    <td data-label="Email">${e.email}</td>
                    <td data-label="Roll Number">${e.RollNumber}</td>
                    <td data-label="Course">${e.course}</td>
                    <td data-label="CNIC">${e.cnic}</td>
                    <td data-label="Gender">${e.gender}</td>
                    <td data-label="Address">${e.address}</td>
                    <td data-label="Status">
                        <select onchange="status(${e.id})" id="status-${e.id}">
                            <option value="Pending" ${e.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Active" ${e.status === 'Active' ? 'selected' : ''}>Active</option>
                            <option value="Reject" ${e.status === 'Reject' ? 'selected' : ''}>Reject</option>
                        </select>
                    </td>
                    <td data-label="Actions">
                        <img src="img/delete.png" alt="Delete" width="35" onclick="dlt(${e.id})" style="cursor:pointer;">
                    </td>
                </tr>`;
}

function localusershowdata(e) {
    table.innerHTML +=
        `<tr>
                    <td data-label="Image"><img src="${e.imgPath}" alt="${e.name}" width="40"></td>
                    <td data-label="Name">${e.name}</td>
                    <td data-label="Father Name">${e.fatherName}</td>
                    <td data-label="Mobile">${e.mobile}</td>
                    <td data-label="Age">${e.age}</td>
                    <td data-label="Email">${e.email}</td>
                    <td data-label="Roll Number">${e.RollNumber}</td>
                    <td data-label="Course">${e.course}</td>
                    <td data-label="CNIC">${e.cnic}</td>
                    <td data-label="Gender">${e.gender}</td>
                    <td data-label="Address">${e.address}</td>
                    <td data-label="Status">${e.status}</td>
                </tr>`;
}


document.getElementById('clearallfilters').addEventListener('click', async () => {
    const { data, error } = await client
        .from('Students')
        .select('*');
    console.log(data);
    data.forEach(e => {
        if (token) {
            adminshowdata1(e)
        } else {
            localusershowdata(e)
        }
    });

})