$(".reserve-button").click(function() {
    $.ajax({
        url: "/url",
        type: "GET",
        success: function(result) {
            console.log(result);
            if (result === 'created') {
                window.location = "/admin/employees";
                return;
            }
            // $('#step').val(result.step);
            // $('#employeeId').val(result.employeeId);
            // $('#frmFields').html(result.data);
            // $(".loader").fadeOut();
            // $('html, body').animate({
            //     scrollTop: $('#addEmployees').offset().top - 10
            // }, 800);
        },
        error: function(xhr) {
            // showNotification("info", 'Something went wrong. Please try again!');
            // jQuery(".loader").fadeOut();
            return false;
        }
    });
});