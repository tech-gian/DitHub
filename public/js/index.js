$(document).ready(() => {
    // Count announcements and setup pagination buttons accordingly
    $.ajax({
        url: "/api/announcements/",
        type: 'GET',
        dataType: 'json',
        success: (res) => {
            for (let i = 1; i <= Math.ceil(res / 5); i++)
                $("#announcements .pagination").append(`<li class="page-item"><a class="page-link" href="#!">${i}</a></li>`);
            $("#announcements .pagination").append(`
                                        <li class="page-item next_page">
                                            <a class="page-link" href="#!" aria-label="Next">
                                                <span aria-hidden="true">&raquo;</span>
                                                <span class="sr-only">Next</span>
                                            </a>
                                        </li>
                                    `);
            $("#announcements .pagination .page-item").eq(1).addClass("active");
        },
        error: () => {
            alert("Could not load announcements. Internal Server Error.");
        }
    });

    // Get the first 5 announcements
    $.ajax({
        url: "/api/announcements/pages/0",
        type: 'GET',
        dataType: 'json',
        success: (res) => {
            for (let i = 0; i < res.length; i++) {
                date = new Date(res[i].updatedAt);
                year = date.getFullYear();
                month = date.getMonth() + 1;
                dt = date.getDate();

                if (dt < 10) {
                    dt = '0' + dt;
                }
                if (month < 10) {
                    month = '0' + month;
                }
                $("#announcements .list-group").append(`<li class="list-group-item">${res[i].title}: &nbsp&nbsp<a href="${res[i].source}" target="_blank">Βρείτε εδώ</a><footer class="blockquote-footer">
                <cite>${dt + '/' + month + '/' + year}</cite>
              </footer></li>`);
            }
        },
        error: () => {
            alert("Internal Server Error.");
        }
    });

    // Previous button
    $("#announcements .pagination").on("click", ".previous_page", function (e) {
        e.preventDefault();
        $(this).parent().find(".active").prevAll(".page-item:first").click();
    });

    // Next button
    $("#announcements .pagination").on("click", ".next_page", function (e) {
        e.preventDefault();
        $(this).parent().find(".active").nextAll(".page-item:first").click();
    });

    // Handle pagination buttons click
    $("#announcements .pagination").on("click", ".page-item", function (e) {
        e.preventDefault();
        if (!$(this).hasClass("next_page") && !$(this).hasClass("previous_page")) {
            $("#announcements .pagination .page-item").removeClass("active");
            $(this).addClass("active");
            $.ajax({
                url: "/api/announcements/pages/" + ($(this).find("a").text() - 1),
                type: 'GET',
                dataType: 'json',
                success: (res) => {
                    $("#announcements .list-group").empty();
                    for (let i = 0; i < res.length; i++) {
                        date = new Date(res[i].updatedAt);
                        year = date.getFullYear();
                        month = date.getMonth() + 1;
                        dt = date.getDate();

                        if (dt < 10) {
                            dt = '0' + dt;
                        }
                        if (month < 10) {
                            month = '0' + month;
                        }
                        $("#announcements .list-group").append(`<li class="list-group-item">${res[i].title}: &nbsp&nbsp<a href="${res[i].source}" target="_blank">Βρείτε εδώ</a><footer class="blockquote-footer">
                        <cite>${dt + '/' + month + '/' + year}</cite>
                    </footer></li>`);
                    }
                },
                error: () => {
                    alert("Internal Server Error.");
                }
            });
        }
    });

    // Count instructions
    $.ajax({
        url: "/api/instructions/",
        type: 'GET',
        dataType: 'json',
        success: (res) => {
            for (let i = 1; i <= Math.ceil(res / 5); i++)
                $("#ins_unit .pagination").append(`<li class="page-item"><a class="page-link" href="#!">${i}</a></li>`);
            $("#ins_unit .pagination").append(`
                                        <li class="page-item next_page">
                                            <a class="page-link" href="#!" aria-label="Next">
                                                <span aria-hidden="true">&raquo;</span>
                                                <span class="sr-only">Next</span>
                                            </a>
                                        </li>
                                    `);
            $("#ins_unit .pagination .page-item").eq(1).addClass("active");
        },
        error: () => {
            alert("Could not load instructions. Internal Server Error.");
        }
    });

    // Get the first 5 instructions
    $.ajax({
        url: "/api/instructions/pages/0",
        type: 'GET',
        dataType: 'json',
        success: (res) => {
            for (let i = 0; i < res.length; i++)
                $("#ins_unit .list-group").append(`<li class="list-group-item">
                <div class="media">
                    <img class="d-flex mr-3" alt="${res[i].link}" src="${res[i].image}">
                    <div class="media-body">
                        <h5 class="mt-0"><a href="instructions/${res[i].link}">${res[i].title}</a></h5>
                        ${res[i].description}
                    </div>
                </div>
                </li>`);
        },
        error: () => {
            alert("Internal Server Error.");
        }
    });

    // Previous button
    $("#ins_unit .pagination").on("click", ".previous_page", function (e) {
        e.preventDefault();
        $(this).parent().find(".active").prevAll(".page-item:first").click();
    });

    // Next button
    $("#ins_unit .pagination").on("click", ".next_page", function (e) {
        e.preventDefault();
        $(this).parent().find(".active").nextAll(".page-item:first").click();
    });

    // Handle pagination buttons click
    $("#ins_unit .pagination").on("click", ".page-item", function (e) {
        e.preventDefault();
        if (!$(this).hasClass("next_page") && !$(this).hasClass("previous_page")) {
            $("#ins_unit .pagination .page-item").removeClass("active");
            $(this).addClass("active");
            $.ajax({
                url: "/api/instructions/pages/" + ($(this).find("a").text() - 1),
                type: 'GET',
                dataType: 'json',
                success: (res) => {
                    $("#ins_unit .list-group").empty();
                    for (let i = 0; i < res.length; i++)
                        $("#ins_unit .list-group").append(`<li class="list-group-item">
                    <div class="media">
                        <img class="d-flex mr-3" alt="${res[i].link}" src="${res[i].image}">
                        <div class="media-body">
                            <h5 class="mt-0"><a href="instructions/${res[i].link}">${res[i].title}</a></h5>
                            ${res[i].description}
                        </div>
                    </div>
                    </li>`);
                },
                error: () => {
                    alert("Internal Server Error.");
                }
            });
        }
    });


    if (location.hash.length > 2) {
        $(this).scrollTop($(window).scrollTop() - 80);
        window.location.hash = '#!';
    }

    let down = 40;
    let up = 38;
    document.onkeydown = (e) => {
        if (e.keyCode == down) {
            // Go to the previous unit on up button click
            if ($(active_unit).nextAll(".unit:first").html()) {
                e.preventDefault();
                active_unit = $(active_unit).nextAll(".unit:first");
                $(document).scrollTop($(active_unit).position().top);
            }
        } else if (e.keyCode == up) {
            // Go to the next unit on down button click
            if ($(active_unit).prevAll(".unit:first").html()) {
                e.preventDefault();
                active_unit = $(active_unit).prevAll(".unit:first");
                $(document).scrollTop($(active_unit).position().top);
            }
        }
    }

    // Change current active navbar unit color on scroll
    $(window).scroll(function () {
        var _elements = $('.unit');
        var active = findMostVisible(_elements);
        if (active) {
            active_unit = active;
            let nav_item_id = "#" + active_unit.attr("id").replace("_unit", "");
            $("nav a").removeClass("active");
            $(nav_item_id).addClass("active");
        }
    });

    function findMostVisible(_elements) {
        // find window top and bottom position.
        var wtop = $(window).scrollTop();
        var wbottom = wtop + $(window).height();

        var max = 0; // use to store value for testing
        var maxEle = false; // use to store most visible element

        // find percentage visible of each element
        _elements.each(function () {
            // get top and bottom position of the current element
            var top = $(this).offset().top;
            var bottom = top + $(this).height();

            // get percentage of the current element
            var cur = eleVisible(top, bottom, wtop, wbottom);

            // if current element is more visible than previous, change maxEle and test value, max 
            if (cur > max) {
                max = cur;
                maxEle = $(this);
            }
        });

        return maxEle;
    }

    // find visible percentage
    function eleVisible(top, bottom, wtop, wbottom) {
        var wheight = wbottom - wtop;

        // both bottom and top is vissible, so 100%
        if (top > wtop && top < wbottom && bottom > wtop && bottom < wbottom) {
            return 100;
        }

        // only top is visible
        if (top > wtop && top < wbottom) {
            return 100 + (wtop - top) / wheight * 100;
        }

        // only bottom is visible
        if (bottom > wtop && bottom < wbottom) {
            return 100 + (bottom - wbottom) / wheight * 100;
        }

        // element is not visible
        return 0;
    }

    $("nav a").not("#home, #forums, #user").click(function (e) {
        e.preventDefault();
        $("nav a").removeClass("active");
        $(this).addClass("active");
        let unit_id = "#" + $(this).attr("id") + "_unit";
        $(document).scrollTop($(unit_id).position().top);
    });

    // Redirect to forum, if the user has signed in
    $("#forums").click((e) => {
        e.preventDefault();
        if (sessionStorage.getItem("token")) {
            window.location.href = "./forum.html";
        } else {
            $("nav a").removeClass("active");
            $(this).addClass("active");
            $(document).scrollTop($("#forums_unit").position().top);
        }
    });

    function toggleSignUp(e) {
        e.preventDefault();
        $('#logreg-forms .form-signin').toggle(); // display:block or none
        $('#logreg-forms .form-signup').toggle(); // display:block or none
    }

    $(() => {
        // Login Register Form
        $('#logreg-forms #btn-signup').click(toggleSignUp);
        $('#logreg-forms #cancel_signup').click(toggleSignUp);
    });

    // Log in
    $(".form-signin").submit((e) => {
        $("#success").addClass("d-none");
        $("#wrong_credentials").addClass("d-none");
        e.preventDefault();
        $.ajax({
            url: "/api/users/login",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ "username": $("#inputUsername").val(), "password": $("#inputPassword").val() }),
            success: (res) => {
                $("#success").removeClass("d-none");
                sessionStorage.setItem("token", res.token);
                sessionStorage.setItem("u_id", res.u_id);
                window.location.replace("./forum.html");
            },
            error: (res) => {
                var resp = res;
                $("#wrong_credentials").removeClass("d-none");
            }
        });
    });

    // Sign up
    $("#form-signup").submit((e) => {
        e.preventDefault();
        $("#signup_success").addClass("d-none");
        $("#user_exists").addClass("d-none");
        $("#passwords_match").addClass("d-none");
        if ($("#user-pass").val() !== $("#user-repeatpass").val()) {
            $("#passwords_match").removeClass("d-none");
        } else {
            $.ajax({
                url: "/api/users/signup",
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ "email": $("#user-email").val(), "username": $("#username").val(), "password": $("#user-pass").val() }),
                success: (res) => {
                    $("#success").removeClass("d-none");
                    sessionStorage.setItem("token", res.token);
                    sessionStorage.setItem("u_id", res.u_id);
                    window.location.replace("./forum.html");
                },
                error: (res) => {
                    var resp = res;
                    $("#user_exists").removeClass("d-none");
                }
            });
        }

    });

    // Forum unit based on log in state
    if (sessionStorage.getItem("token")) {
        $("#logreg-forms").hide();
        $("#has_logged_in").removeClass("d-none");
    }
});
