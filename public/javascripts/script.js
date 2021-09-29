$("#login-submit").on("click", () => {
  $("#admin-login").validate({
    rules: {
      username: {
        required: true,
      },
      password: {
        required: true,
        minlength: 4,
      },
    },
    highlight: function (element) {
      $(element).css("border-color", "red");
      $(element).parent().addClass("error");
    },
    unhighlight: function (element) {
      $(element).css("border-color", "green");
      $(element).parent().removeClass("error");
    },
    onsubmit: true,
  });
});

$("#add-domain").on("click", (e) => {
  e.preventDefault();
  let TLD_NAME = document.getElementById("TLD_NAME").value;
  let TLD_CLASS = document.getElementById("TLD_CLASS").value;
  let TLD_STAT = "pending";
  $.ajax({
    url: "addtld",
    type: "post",
    data: {
      TLD_NAME,
      TLD_CLASS,
      TLD_STAT,
    },
    success: (response) => {
      if (response) {
        $("#success-msg").html("added successfully").css("display", "block");
        $("#subadmin-tld > tbody:last-child").append(
          "<tr>" + TLD_NAME + "</tr>" + TLD_CLASS + "<tr>" + TLD_STAT + "</tr>"
        );
        $("#subadmin-tdl-status").load(location.href + " #subadmin-tdl-status");
      }
    },
  });
});

function updateTld(event) {
  event.preventDefault();
  let TLD_STAT = event.target.value;
  let id = event.target.id;

  $.ajax({
    url: "tldstatusupdate",
    type: "post",
    data: {
      TLD_STAT,
      id,
    },
    success: (response) => {
      if (response == true) {
        $("#tld_table").load(location.href + " #tld_table");
        $("#subadmin-tdl-status").load(location.href + " #subadmin-tdl-status");
      }
    },
  });
}

$(document).ready(function () {
  let ext = document.getElementById("extention").value;
  $("#basic-addon2").html(ext);
});

$("#primeuser-submit").on("click", () => {
  console.log("button clicked");
  $("#prime-user-register").validate({
    rules: {
      Domain: {
        required: true,
      },
      ed: {
        required: true,
      },
      username: {
        required: true,
      },
    },
    highlight: function (element) {
      $(element).css("border-color", "red");
      $(element).parent().addClass("error");
    },
    unhighlight: function (element) {
      $(element).css("border-color", "green");
      $(element).parent().removeClass("error");
    },
    onsubmit: true,
  });
});

function blockChar(input) {
  let regex = /[^a-z 0-9]/gi;
  input.value = input.value.replace(regex, "");
}

$("#extention").on("change", () => {
  let ext = $("#extention :selected").text();
  let domainName = $("#Domain").val();
  let emailExt = "@" + domainName + "." + ext;
  $("#basic-addon2").html(emailExt);
});

$('input[name="domain"]').on("change", () => {
  let isDomain = $('input[name="domain"]:checked').val();
  if (isDomain == "false") {
    window.location.href = "no-domain";
  }
});

//to reload while pressing backbutton
// window.addEventListener("pageshow", function (event) {
//   var historyTraversal =
//     event.persisted ||
//     (typeof window.performance != "undefined" &&
//       window.performance.navigation.type === 2);
//   if (historyTraversal) {
//     // Handle page restore.
//     window.location.reload();
//   }
// });

$("#service-submit").on("click", () => {
  $("#service-registration").validate({
    rules: {
      domain: {
        required: true,
      },
      host: {
        required: true,
      },
      email: {
        required: true,
      },
      flexCheckDefault: {
        required: true,
      },
    },
    errorPlacement: function (error, element) {
      if (element.is(":radio")) {
        error.appendTo(element.parent("#error"));
      }
    },
    highlight: function (error, element) {
      $(element).css("border-color", "red");
      $(element).parent().addClass("error");
    },
    unhighlight: function (element) {
      $(element).css("border-color", "green");
      $(element).parent().removeClass("error");
    },
  });
});

$("#Domain").on("change", (event) => {
  let ext = event.target.value;
  let emailExt = "@" + ext + "." + document.getElementById("extention").value;
  $("#basic-addon2").html(emailExt);
});

function show_sidebar(id) {
  $("#" + id).show();
}

function hide_sidebar(id) {
  document.getElementById(id).style.display = "none";
}

function tst(name, body, link) {
  document.getElementById("ptitle").innerHTML = name;
  document.getElementById("pbody").innerHTML = body;
  document.getElementById("poplink").href = link;
  document.getElementById("poplink").innerHTML = name;

  var myModal = new bootstrap.Modal(document.getElementById("txt"));
  myModal.show();
}

$("#add-user").on("click", (e) => {
  $("#add-adminuser").validate({
    rules: {
      username: {
        required: true,
      },
      email: {
        required: true,
      },
      mobile: {
        required: true,
      },
      password: {
        required: true,
      },
      jobs: {
        required: true,
      },
    },
    highlight: function (element) {
      $(element).css("border-color", "red");
      $(element).parent().addClass("error");
    },
    unhighlight: function (element) {
      $(element).css("border-color", "green");
      $(element).parent().removeClass("error");
    },

    submitHandler: (form) => {
      $.ajax({
        url: form.action,
        type: form.method,
        data: $(form).serialize(),
        success: (response) => {
          if (response === true) {
            $("#msg").html("added succes").css("color", "green");
            $("#msg").delay(1000).hide(0);
            setTimeout(function () {
              location.reload();
            }, 100);
          } else {
            console.log(false);
          }
        },
      });
    },
  });
});

// let count = 0

// $('#addcat').on('click',(event)=>{
//   event.preventDefault()

//   let form = document.getElementById('form-test'+count)
//   count++
//   var html = '  <div class="form-row" id="form-test'+count+'"><div class="form-group col-md-6"><label for="category"></label>     <input type="text" class="form-control" id="category" name="category" placeholder="category"></div> <div class="form-group col-md-4"></div></div>'
//   $(form).after(html)
// })

$("#addService").on("click", (e) => {
  e.preventDefault();
  console.log("button clicked");
  let service = document.getElementById("service").value;
  if (service === "") {
    alert("empty category");
  } else {
    $.ajax({
      url: "add-service",
      type: "post",
      data: {
        service,
      },
      success: (res) => {
        console.log(res);
        if (res.category === true) {
          alert("category exist");
        } else if (res.added === true) {
          alert("category addedd successfully");
        } else {
          alert("cannot add this category");
        }
      },
    });
  }
});

function getFormData(formName) {
  var formObj = {};
  var inputs = $(formName).serializeArray();
  $.each(inputs, function (i, input) {
    formObj[input.name] = input.value;
  });

  let data = JSON.stringify(formObj);
  return data;
}

function updateStatus(event) {
  event.preventDefault();
  let status = event.target.value;
  let id = event.target.id;
  $.ajax({
    url: "update-service",
    type: "post",
    data: {
      status,
      id,
    },
    success: (res) => {
      if (res === true) {
        $("#service_table").load(location.href + " #service_table");
      } else if (res === false) {
        console.log("cannot add this");
      }
    },
  });
}

$("#add-subcat").on("click", (e) => {
  e.preventDefault();
  console.log("button clicked");
});

$("#addCat").on("click", (e) => {
  e.preventDefault();
  console.log("button clicked");
  let category = $("#category").val();
  let service = $("#service-drop").find(":selected").val();
  $.ajax({
    url: "add-category",
    type: "post",
    data: {
      category,
      service,
    },
  });
});

// function fileUpload(){
//    fileValidation()
// }

// function fileValidation(){
//     let myFile = document.getElementById('myFile')
//     var allowedExtensions =
//     /(\.txt|\.xls|\.xlsx|\.csv)$/i;
//     console.log(allowedExtensions)
//     if (!allowedExtensions.exec(myFile)) {
//         alert('Invalid file type');
//         myFile.value = '';
//         return false;
//     }
// }

$("#ad").on("click", (e) => {
  let myFile = document.getElementById("myFile");
  console.log(myFile);
  if (myFile === undefined) {
    alert("cannot empty file");
  } else {
    console.log("file upload complete");
  }
});

$("#add-keywords").on("click", (e) => {
  e.preventDefault();
  let keyword_collection = document.getElementById("keyword_collection").value;
  let status = "pending";
  console.log(keyword_collection);
  if (keyword_collection === "") {
    alert("enter keyword to continue");
  } else {
    $.ajax({
      url: "add-keyword_table",
      type: "post",
      data: {
        keyword_collection,
        status,
      },
      success: (res) => {
        if (res.collection === "exist") {
          alert("table exist");
        } else {
          alert("added successfully");
        }
      },
    });
  }
});

function updateCollection(event) {
  event.preventDefault();
  let status = event.target.value;
  let id = event.target.id;
  $.ajax({
    url: "update-collection-status",
    type: "post",
    data: {
      status,
      id,
    },
    success: (res) => {
      console.log(res);
    },
  });
}

$("#add-keyword-form").submit((e) => {
  e.preventDefault();
  $.ajax({
    url: "upload-keyword",
    type: "post",
    data: new FormData(document.getElementById("add-keyword-form")),
    processData: false,
    contentType: false,
  });

  return false;
});

$("#ser-key").change((e) => {
  e.preventDefault();
  let t = document.getElementById("kk");
  let collId = e.target.value;
  $.ajax({
    url: "/get-keywords",
    type: "post",
    data: {
      collId,
    },
    success: (data) => {
        
        data.forEach(element => {
          let pElement = ' <p id="dr" draggable="true">'+element.keyword_name+'</p>'
            document.getElementById('dis').innerHTML += pElement
        });
    },
  });
});






