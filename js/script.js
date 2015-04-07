$(function() {


    var usr, mail, pass
        //----This part to validate the inputs of the user
    var dialog, form,

        // From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
        emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        name = $("#name"),
        email = $("#email"),
        password = $("#password"),
        allFields = $([]).add(name).add(email).add(password),
        tips = $(".validateTips");
    //---to display the text as password
    /*password.addEventListener("keyup",function(){
        pass = pass.html();
        
        
    });*/
    function updateTips(t) {
        tips
            .text(t)
            .addClass("ui-state-highlight");
        setTimeout(function() {
            tips.removeClass("ui-state-highlight", 1500);
        }, 500);
    }

    function checkLength(o, n, min, max) {
        if (o.html().length > max || o.html().length < min) {
            o.addClass("ui-state-error");
            updateTips("Length of " + n + " must be between " +
                min + " and " + max + ".");
            return false;
        } else {
            return true;
        }
    }

    function checkRegexp(o, regexp, n) {
        if (!(regexp.test(o.html()))) {
            o.addClass("ui-state-error");
            updateTips(n);
            return false;
        } else {
            return true;
        }
    }

    function addUser() {
        var valid = true;
        allFields.removeClass("ui-state-error");

        valid = valid && checkLength(name, "username", 3, 16);
        valid = valid && checkLength(email, "email", 6, 80);
        valid = valid && checkLength(password, "password", 5, 16);

        valid = valid && checkRegexp(name, /^[a-z]([0-9a-z_\s])+$/i, "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter.");
        valid = valid && checkRegexp(email, emailRegex, "eg. ui@jquery.com");
        valid = valid && checkRegexp(password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9");

        if (valid) {
            /*$("#users tbody").append("<tr>" +
                "<td>" + name.html() + "</td>" +
                "<td>" + email.html() + "</td>" +
                "<td>" + password.html() + "</td>" +
                "</tr>");*/

            usr = name.html();
            mail = email.html();
            //pass = password.html();

            localStorage.setItem("usr", usr);
            localStorage.setItem("mail", mail);
            localStorage.setItem("pass", pass);
            console.log(usr);
            console.log(mail);
            console.log(pass);

            dialog.dialog("close");
        }
        return valid;
    }

    dialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 300,
        width: 350,
        modal: true,
        buttons: {
            "Create an account": addUser,
            /* Cancel: function() {
          dialog.dialog( "close" );
        }
      },
      close: function() {
        form[ 0 ].reset();
        allFields.removeClass( "ui-state-error" );*/
        }
    });

    form = dialog.find("form").on("submit", function(event) {
        event.preventDefault();
        addUser();
    });

    /* $("#create-user").button().on("click", function() {
        dialog.dialog("open");
    });
*/
    ///---------------------****************************-------------------------------------------------------------************

    //if the device connected to internaet
    if (navigator.onLine) {
        alert("online");

        //--Check if the user name and password saved before
        if (localStorage.getItem("usr") == null && localStorage.getItem("pass") == null && localStorage.getItem("mail") == null) {
            //--open the log in pop up
            dialog.dialog("open");
        } else { //the data sotred before ---> load the activity
            usr = localStorage.getItem("usr");
            mail = localStorage.getItem("mail");
            pass = localStorage.getItem("pass");

            alert(localStorage.getItem("usr"));
        }

    } else { //if the device is not connected to internet


        alert("offline");
    }

    function tincanfun(activityid) {
        activityid = "www.learnmix.com/" + activityid;
        var tincan = new TinCan({
            recordStores: [{
                endpoint: "https://cloud.scorm.com/tc/BOOOCQR3M7/",
                username: usr,
                password: pass,
                allowFail: false
            }]
        });
        tincan.sendStatement({
            actor: {
                mbox: mail
            },
            verb: {
                id: "http://adlnet.gov/expapi/verbs/attempted"
            },
            target: {
                id: activityid
            }
        });
    }

});