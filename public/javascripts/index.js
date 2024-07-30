$(document).ready(function () {
    $('#user-menu-button').click(function () {
        $('#menu-dropdown').toggleClass('hidden');
    });

    $('[data-drawer-toggle="logo-sidebar"]').click(function () {
        $('#logo-sidebar').toggleClass('translate-x-0');
    });

    $("#open-modal").click(function () {
        $("#crud-modal").removeClass("hidden");
    });
    $("#close-modal, #modal-background").click(function () {
        $("#crud-modal").addClass("hidden");
    });
    // Prevent closing the modal when clicking inside the modal content
    $(".relative.bg-white.rounded-lg.shadow.dark\\:bg-gray-700").click(function (event) {
        event.stopPropagation();
    });

    $('.deleteRecord').click(function () {
        console.log("called deleted records");
        var id = $(this).data('id');
        var url = $(this).data('url');
        if (confirm('Are you sure you want to delete this record?')) {
            $.ajax({
                url: `/${url}/${id}`,
                type: 'DELETE',
                success: function (result) {
                    location.reload();
                },
                error: function (err) {
                    console.error('Error deleting record:', err);
                }
            });
        }
    });

    $('.changeStatus').click(function () {
        var id = $(this).data('id');
        var url = $(this).data('url');
        $.ajax({
            url: `/${url}/status/${id}`,
            type: 'PUT',
            success: function (result) {
                // location.reload();
                console.log("result =>", result);
            },
            error: function (err) {
                console.error('Error changing status:', err);
            }
        });
    });
});