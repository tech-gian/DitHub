$(document).ready(() => {
    // If the user has not accepted cookies yet
    if (sessionStorage.getItem("cookies") !== "true") {
        $("#cookies").fadeIn("slow");
    }

    // If the user has signed in, show log out option
    if (sessionStorage.getItem("u_id")) {
        $(".user_name").text(sessionStorage.getItem("u_id"));
        $("#user").hide();
    } else {
        $(".user_con").hide();
    }

    // Clear sessionStorage on log out
    $(".logout").click((e) => {
        e.preventDefault();
        sessionStorage.clear();
        location.reload();
    });

    // Hide cookies toast on accept button click
    $(".accept_cookies").click(function () {
        $("#cookies").hide();
        sessionStorage.setItem("cookies", "true");
    });

    // Collapse mobile navbar on navbar button click
    $(".navbar-mobile .collapse a:not(.dropdown-toggle)").click(function () {
        $(".navbar-mobile .navbar-toggler").click();
    });
});
