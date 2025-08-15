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