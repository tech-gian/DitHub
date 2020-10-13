$(document).ready(() => {
    let active_team = null;
    let msg_id = null;
    let teams = [];
    let active_message = null;
    let show_coms = false;

    //  Load all teams on page load
    $.ajax({
        url: "/api/teams",
        type: 'GET',
        dataType: 'json',
        success: (res) => {
            for (let i = 0; i < res.length; i++) {
                $("#teams_list").prepend(`<a href="#" class="list-group-item list-group-item-action" id="${res[i]._id}">${res[i].title}</a>`);
                teams.push({ "title": res[i].title.toLowerCase(), "id": res[i]._id });
            }
        },
        error: () => {
            alert("Could not load teams. Internal Server Error.");
        }
    });

    // Add new team button click handle
    $("#add_bar button").click(() => {
        if (!sessionStorage.getItem("token")) {
            // If the user is not signed in
            $('#login_modal').modal('show');
        } else {
            $.ajax({
                url: "/api/teams",
                type: 'POST',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ "title": $("#add_bar input").val() }),
                headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
                success: (res) => {
                    $("#teams_list").prepend(`<a href="#" class="list-group-item list-group-item-action" id="${res._id}">${res.title}</a>`);
                    $("#add_bar input").val("");
                    teams.push({ "title": res.title, "id": res._id });
                },
                error: () => {
                    alert("Internal Server Error.");
                }
            });
        }

    });

    // Load messages on team selection
    $("#teams_list").on("click", "a", function (e) {
        e.preventDefault();
        $("#teams_list a").removeClass("active");
        $(this).addClass("active");
        let team_id = $(this).attr("id");
        active_team = team_id;
        let team_title = $(this).text();
        $.ajax({
            url: "/api/teams/" + team_id + "/messages",
            type: 'GET',
            dataType: 'json',
            success: (res) => {
                $("#select_team").hide();
                $("#chat_collapse_btn").click();
                $("#main-window #team_name").text(team_title);
                $("#main-window #display_messages").html("");
                for (let i = 0; i < res.length; i++) {
                    date = new Date(res[i].date);
                    year = date.getFullYear();
                    month = date.getMonth() + 1;
                    dt = date.getDate();
                    h = date.getHours();
                    min = date.getMinutes();

                    if (dt < 10) {
                        dt = '0' + dt;
                    }
                    if (month < 10) {
                        month = '0' + month;
                    }
                    if (min < 10) {
                        min = '0' + min;
                    }
                    if (h < 10) {
                        h = '0' + h;
                    }
                    // If the author of the message is not the user
                    if (res[i].author.username !== sessionStorage.getItem("u_id")) {
                        $("#main-window #display_messages").append(`
                        <div class="row" id="${res[i]._id}">
                        <div class="card message-op col-12">
                            <div class="card-body">
                                <h6 class="card-subtitle mb-2 text-muted"><em>${res[i].author.username}</em> <em
                                        style="float: right;">${dt + '/' + month + '/' + year + " " + h + ":" + min}</em></h6>
                                <p class="card-text" style="white-space: pre-wrap;">${res[i].text}</p>

                                <div class="pull-right">
                                    <button class="btn load_comments" type="button" data-toggle="collapse"
                                        data-target="${res[i]._id}_comments" aria-expanded="false"
                                        aria-controls="${res[i]._id}_comments">Comments
                                    </button>

                                    <button class="btn reply" type="button" target="${res[i]._id}"><i class="fa fa-share"></i> Reply</button>
                                </div>

                                <div class="collapse" id="${res[i]._id}_comments"></div>
                            </div>
                        </div>
                        </div>`);
                    } else {
                        // If the author of the message is the user
                        $("#main-window #display_messages").append(`
                        <div class="row" id="${res[i]._id}">
                            <div class="card message-self col-12">
                                <div class="card-body">
                                    <h6 class="card-subtitle mb-2 text-muted">
                                        <button class="btn btn-danger del_msg_btn" style="float: right;"
                                            type="button" target="${res[i]._id}"><i class="fa fa-trash"></i>
                                        </button>
                                        <em>${res[i].author.username}</em>
                                        <em style="float: right;">${dt + '/' + month + '/' + year + " " + h + ":" + min}</em>
                                    </h6>
                                    <p class="card-text" style="white-space: pre-wrap;">${res[i].text}</p>

                                    <div class="pull-right">
                                        <button class="btn load_comments" type="button" data-toggle="collapse"
                                            data-target="${res[i]._id}_comments" aria-expanded="false"
                                            aria-controls="${res[i]._id}_comments">Comments
                                        </button>

                                        <button class="btn reply" type="button" target="${res[i]._id}"><i class="fa fa-share"></i> Reply</button>
                                    </div>

                                    <div class="collapse" id="${res[i]._id}_comments"></div>
                                </div>
                            </div>
                        </div>`);
                    }
                }
                $("#display_messages").scrollTop(function () { return this.scrollHeight; });
            },
            error: () => {
                alert("Could not load messages. Internal Server Error.");
            }
        });
    });

    // Load comments of a message on Load Comments button click
    $(".card-body").on("click", ".load_comments", function (e) {
        e.stopPropagation();
        let msg_id = "#" + $(this).attr("data-target");
        $(msg_id).toggle();
        if ($(msg_id).is(":visible") || show_coms) {
            $.ajax({
                url: "/api/teams/" + active_team + "/messages/" + msg_id.replace("_comments", "").replace("#", "") + "/comments",
                type: 'GET',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                success: (res) => {
                    $(msg_id).empty();
                    for (let i = 0; i < res.length; i++) {
                        date = new Date(res[i].date);
                        year = date.getFullYear();
                        month = date.getMonth() + 1;
                        dt = date.getDate();
                        h = date.getHours();
                        min = date.getMinutes();

                        if (dt < 10) {
                            dt = '0' + dt;
                        }
                        if (month < 10) {
                            month = '0' + month;
                        }
                        if (min < 10) {
                            min = '0' + min;
                        }
                        if (h < 10) {
                            h = '0' + h;
                        }
                        $(msg_id).append(`
                                            <div class="card card-body comment col-12">
                                                <h6 class="card-subtitle mb-2 text-muted"><em>${res[i].author.username}</em> <em class="pull-right">${dt + '/' + month + '/' + year + " " + h + ":" + min}</em></h6>
                                                <p style="white-space: pre-wrap; word-break: break-all;">${res[i].text}</p>
                                            </div>
                                        `);
                    }
                    if (!res.length)
                        $(msg_id).append(`  <div class="alert alert-danger" style="display: table;" role="alert">
                                                Δεν υπάρχουν σχόλια!
                                            </div>
                                        `);
                },
                error: () => {
                    alert("Could not load comments. Internal Server Error.");
                }
            });
        }
    });

    // Handle reply button click
    $(".card-body").on("click", ".reply", function (e) {
        e.stopPropagation();
        $(".reply").removeClass("highlight");
        $(".row").removeClass("highlight_message");
        $(this).parent().parent().parent().parent().addClass("highlight_message");
        $(this).addClass("highlight");
        active_message = $(this).attr("target");
        $("#replying").show();
    });

    $("#main-window").click(function (e) {
        $(".reply").removeClass("highlight");
        $(".row").removeClass("highlight_message");
        active_message = null;
        $("#replying").hide();
    });

    // Handle delete message button click
    $(".card-body").on("click", ".del_msg_btn", function (e) {
        msg_id = $(this).attr("target");
        $("#del_msg").modal('show');
    });

    $("#confirm_delete").click((e) => {
        $.ajax({
            url: "/api/teams/" + active_team + "/messages/" + msg_id,
            type: 'DELETE',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
            success: (res) => {
                $("#" + msg_id).remove();
            },
            error: () => {
                alert("Internal Server Error.");
            }
        });
    });

    // Send message or a comment
    $("#send_message").click(() => {
        if (sessionStorage.getItem("token")) {
            // If the user has signed in
            if (active_team) {
                if (active_message) {
                    $.ajax({
                        url: "/api/teams/" + active_team + "/messages/" + active_message + "/comments",
                        type: 'POST',
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({ "text": $("#message_textarea").val() }),
                        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
                        success: (res) => {
                            $("#message_textarea").val("");
                            show_coms = true;
                            $("#" + active_message + " .load_comments").click();
                            $("#" + active_message + "_comments").show();
                            show_coms = false;
                        },
                        error: () => {
                            alert("Comment was not submitted. Internal Server Error.");
                        }
                    });
                } else {
                    $.ajax({
                        url: "/api/teams/" + active_team + "/messages",
                        type: 'POST',
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({ "text": $("#message_textarea").val() }),
                        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
                        success: (res) => {
                            $("#message_textarea").val("");
                            date = new Date();
                            year = date.getFullYear();
                            month = date.getMonth() + 1;
                            dt = date.getDate();
                            h = date.getHours();
                            min = date.getMinutes();

                            if (dt < 10) {
                                dt = '0' + dt;
                            }
                            if (month < 10) {
                                month = '0' + month;
                            }
                            if (min < 10) {
                                min = '0' + min;
                            }
                            if (h < 10) {
                                h = '0' + h;
                            }
                            $("#main-window #display_messages").append(`
                        <div class="row" id="${res._id}">
                            <div class="card message-self col-12">
                                <div class="card-body">
                                    <h6 class="card-subtitle mb-2 text-muted"><button class="btn btn-danger del_msg_btn" style="float: right;"
                                    type="button" target="${res._id}"><i class="fa fa-trash"></i></button><em>${sessionStorage.getItem("u_id")}</em> <em
                                            style="float: right;">${dt + '/' + month + '/' + year + " " + h + ":" + min}</em></h6>
                                    <p class="card-text" style="white-space: pre-wrap;">${res.text}</p>

                                    <div class="pull-right">
                                        <button class="btn load_comments" type="button" data-toggle="collapse"
                                            data-target="${res._id}_comments" aria-expanded="false"
                                            aria-controls="${res._id}_comments">Comments
                                        </button>

                                        <button class="btn reply" type="button" target="${res._id}"><i class="fa fa-share"></i> Reply</button>
                                    </div>

                                    <div class="collapse" id="${res._id}_comments"></div>
                                </div>
                            </div>
                        </div>`);
                            $("#display_messages").scrollTop(function () { return this.scrollHeight; });
                        },
                        error: () => {
                            alert("Message was not sent. Internal Server Error.");
                        }
                    });
                }
            }
        } else {
            // If the user has not signed in
            $('#login_modal').modal('show');
        }
    });

    // Search functionality
    $("#team_search").on("input", function (e) {
        let match = teams.filter(team => team.title.includes($("#team_search").val())).map(team => team.id);
        $("#teams_list a").each(function (e) {
            $(this).show();
            if (match.indexOf($(this).attr("id")) == -1) {
                $(this).hide();
            }
        });
    })

    // Handle Teams and Chat button click on mobile
    $("#teams_collapse_btn").click(function () {
        if ($("#teams").hasClass("collapse")) {
            $("#teams").removeClass("collapse");
            $("#chat").addClass("collapse");
        }
    });

    $("#chat_collapse_btn").click(function () {
        if ($("#chat").hasClass("collapse")) {
            $("#chat").removeClass("collapse");
            $("#teams").addClass("collapse");
        }
    });
});
