(function () {
    //一定要有以下設定
    // <div id="navbar"></div>

    // 載入nav.html
    // $("#navbar").load()可以用if寫法帶出true or false，避免抓不到資料
    $("#navbar").load("250208-nav.html", function () {
        // 取得當前頁面名稱
        var currentPage = window.location.pathname.split("/").pop();
        if (currentPage == "") {
            currentPage = "/";
        }
        $(".nav-link").each(function () {
            var link = $(this).attr("href");
            if (link === currentPage) {

                // 加上active樣式
                $(this).addClass("active");
            } else {
                // 移除其他active
                $(this).removeClass("active");
            }
        });

        // 登出鍵
        $("#s02_logout_btn").click(function () {
            console.log("777");
            setCookie("Uid01", "", 7);
            location.href = "250115_SPA-index_v1.html";
        });
    });




   
    //w3c
    function getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }


    //檢查uid是否存在, 若不存在則導向登入畫面
    if (!getCookie("Uid01")) {
        Swal.fire({
            title: "請先登入會員!",
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "確認",
            denyButtonText: `Don't save`,
            allowOutsideClick: false
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                location.href = "250115_SPA-index_v1.html";
            }
        });

        return;
    }

    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    //若uid存在, 傳遞至後端API執行驗證
    var JSONdata = {};
    JSONdata["uid01"] = getCookie("Uid01");
    console.log(JSON.stringify(JSONdata));

    $.ajax({
        type: "POST",
        url: "250121-member_control_api_v1.php?action=checkuid",
        data: JSON.stringify(JSONdata),
        dataType: "json",
        success: function (data) {
            if (data.state) {
               
            //    登出鍵先強迫監聽
                // $("#s02_logout_btn").click(function () {
                //     console.log("777");
                //     setCookie("Uid01", "", 7);
                //     location.href = "250115_SPA-index_v1.html";
                // });
                //顯示歡迎訊息
                $("#s02_username_showtext").removeClass("d-none");
                $("#s02_username_text").text(data.data.Username);

                //顯示登出按鈕
                $("#s02_logout_btn").removeClass("d-none");

            } else {
                Swal.fire({
                    title: "請先登入會員!",
                    showDenyButton: false,
                    showCancelButton: false,
                    confirmButtonText: "確認",
                    denyButtonText: `Don't save`,
                    allowOutsideClick: false
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        location.href = "250115_SPA-index_v1.html";
                    }
                });
            }

        },

        error: function () {
            Swal.fire({
                title: "API介接錯誤!",
                text: "250121-member_control_api_v1.php?action=checkuid",
                icon: "error"
            });
        }
    });

    // console.log("dddddddddddddddddddddddddddddddddddddd");
    // s02_logout_btn按鈕監聽
    $(".navbar").bind("#s02_logout_btn", "click",function () {
        // console.log("777");
        setCookie("Uid01", "", 7);
        location.href = "250115_SPA-index_v1.html";
    });
    // $("#s02_logout_btn").click(function () {
    //     console.log("777");
    //     setCookie("Uid01", "", 7);
    //     location.href = "250115_SPA-index_v1.html";
    // });




})();