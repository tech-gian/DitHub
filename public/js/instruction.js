$(document).ready(() => {
    let url = window.location.href;
    let instructionId = url.substring(url.lastIndexOf('/') + 1);    // domain.tld/instructions/:InstructionId
    $.ajax({
        url: "/api/instructions/" + instructionId,
        type: 'GET',
        dataType: 'json',
        success: (res) => {
            if(!res)
                window.location.replace("../error_404.html");
            document.title = "DitHub - " + res.title;
            $("#title").text(res.title);
            $.ajax({
                url: res.file,
                type: 'GET',
                success: (data) => {
                    if(!data)
                        window.location.replace("../error_404.html");
                    document.getElementById("content").innerHTML = data;
                },
                error: () => {
                    alert("Could not load content. Internal Server Error.");
                }
            });
        },
        error: () => {
            alert("Internal Server Error.");
        }
    });

    $("#forums").click((e) => {
        e.preventDefault();
        if (sessionStorage.getItem("token")) {
            window.location.href = "../forum.html";
        } else {
            window.location.href = "../index.html#forums_unit"
        }
    });
});
