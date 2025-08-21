const supabaseUrl = 'https://ipoviueuhflhqjemgfkw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlwb3ZpdWV1aGZsaHFqZW1nZmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mzc5NzEsImV4cCI6MjA2ODUxMzk3MX0.ACNfp4MRa7-r1YYmu04VDltBo5UudrKWWw2NyDPBrk0'
const client = supabase.createClient(supabaseUrl, supabaseKey)
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

// Check authentication
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        toastr.error('Please login to access admin panel');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
});

// View students function
function CheckStudent() {
    // Add ripple effect animation
    const btn = event.currentTarget;
    btn.classList.add('active');
    setTimeout(() => {
        btn.classList.remove('active');
        window.location.href = 'StudentsData.html';
    }, 300);
}

// Admin logout function
function adminlogout() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out from the admin panel",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4B2574',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, log out!'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('authToken');
            toastr.info('Logged out successfully');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    });
}

function Checkattendance() {
    Swal.fire({
        title: "Check Attendance",
        confirmButtonText: 'Check',
        showCancelButton: true,
        html: `<input type="number" class="" id="markRoll" placeholder="Enter Roll Number">`,
    }).then(async () => {

        const roll = document.getElementById('markRoll').value
        const table = document.getElementById('table')
        const main = document.getElementById('main')
        const tbody = document.getElementById('tbody')
        const { data } = await client
            .from('Attendance')
            .select('*')
            .eq('RollNumber', roll)
        // console.log(data);
        if (data.length == 0) {
            toastr.info('No attendance for this Student')
            return
        }
        main.style.display= 'none'
        table.style.display= 'block'
        data.forEach(element => {
            tbody.innerHTML += `
           <tr>
           <td>${element.date}</td>
           <td>${element.StdName}</td>
           <td>${element.status}</td>
           <td>${element.RollNumber}</td>
           </tr>`
        });


    })



}