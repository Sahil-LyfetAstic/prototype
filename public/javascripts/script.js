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

    submitHandler: (form) => {
      $.ajax({
        url: form.action,
        type: form.method,
        data: $(form).serialize(),
        success: (response) => {
          console.log(response);
          if (response.user === false) {
            alert("no user found");
          } else if (response.status === false) {
            alert("cannot login at this time");
          } else if (response.passId === false) {
            alert("Incorrect password");
          } else {
            window.location.href = response;
          }
        },
      });
    },
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
          console.log(response);
          if (response === true) {
            alert("user added successfully");
          } else if (response.user === true) {
            alert("user already exist");
          } else {
            alert("cannot add this user");
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
    success: (response) => {
      if (response === true) {
        console.log(response);
        $("#uploadmsg").html("added succes").css("color", "green").show();
        $("#uploadmsg").delay(1000).hide(0);
        $("#add-keyword-form").load(location.href + " #add-keyword-form");
      } else {
        $("#uploadmsg")
          .html("file format not support")
          .css("color", "red")
          .show();
        $("#uploadmsg").delay(1000).hide(0);
        $("#add-keyword-form").load(location.href + " #add-keyword-form");
      }
    },
  });

  // return false;
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
      data.forEach((element) => {
        let test = "a" + element._id + 1;
        console.log(test);

        let pElement =
          ' <div class="accordion" id="a' +
          element._id +
          '" class="example-draggable" draggable="true" ondragstart="onDragStart(event);"> <div class="accordion-item"> <h2 class="accordion-header" id="headingTwo"> <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#' +
          test +
          '"  aria-expanded="false" aria-controls="' +
          test +
          '"> ' +
          element.keyword_name +
          '</button></h2> <div id="' +
          test +
          '" class="accordion-collapse collapse"  aria-labelledby="headingTwo" data-bs-parent="#a' +
          element._id +
          '"> <div class="accordion-body" ondragover="onDragOver(event);" ondrop="onDrop(event);"></div></div></div></div> </br>';

        document.getElementById("dis").innerHTML += pElement;
      });
    },
  });
});

// $('#dr').on('drag',()=>{
//   console.log('hello')
// })

// function drager(){

//   var p = document.getElementsByTagName('p')
//   var choice = document.getElementsByClassName('list2')

//   // var dragItem = null;
//   for(var i of p){
//       i.addEventListener('dragstart',dragStart);
//       i.addEventListener('dragend',dragEnd);
//   }
//   function dragStart(){
//     console.log("drag start")
//     dragItem = this;
//     console.log(this)
//     setTimeout(()=> this.style.display = "none", 0)
// }

// function dragEnd(){
//     console.log("drag end")
//     setTimeout(()=> this.style.display = "block",0)
//       dragItem = null;
// }
// for(j of choice){
//     j.addEventListener('dragover',dragOver);
//     j.addEventListener('dragenter',dragEnter);
//     j.addEventListener('dragleave',dragLeave);
//     j.addEventListener('drop',Drop)
// }

// function dragOver(e){
//     e.preventDefault();
//     this.style.border = "2px dotted cyan"
// }
// function dragEnter(e){
//     e.preventDefault()
// }
// function dragLeave(){

// }
// function Drop(){
//     this.append(dragItem)
// }

// }

// function clicke(cls){
//   console.log(cls)
// }

// function onDragStart(event) {
//   event.dataTransfer.setData("text/plain", event.target.id);

//   event.currentTarget.style.backgroundColor = "yellow";
// }

// function onDragOver(event) {
//   event.preventDefault();
// }

// function onDrop(event) {
//   const id = event.dataTransfer.getData("text");
//   const draggableElement = document.getElementById(id);
//   const dropzone = event.target;

//   dropzone.appendChild(draggableElement);
//   event.dataTransfer.clearData();
// }

$("#add-keyword-form").submit((e) => {
  e.preventDefault();
  $.ajax({
    url: "upload-keyword",
    type: "post",
    data: new FormData(document.getElementById("add-keyword-form")),
    processData: false,
    contentType: false,
    success: (response) => {
      if (response === true) {
        console.log(response);
        $("#uploadmsg").html("added succes").css("color", "green").show();
        $("#uploadmsg").delay(1000).hide(0);
        $("#add-keyword-form").load(location.href + " #add-keyword-form");
      } else {
        $("#uploadmsg")
          .html("file format not support")
          .css("color", "red")
          .show();
        $("#uploadmsg").delay(1000).hide(0);
        $("#add-keyword-form").load(location.href + " #add-keyword-form");
      }
    },
  });

  // return false;
});

// function onDragStart(event) {
//   event.dataTransfer.setData("text/plain", event.target.id);
// }

// function onDragOver(event) {
//   event.preventDefault();
// }

// var count = 0;
// let test = false;
// function onDrop(event) {
//   console.log(event.target.className);

//   if (
//     event.target.className === "accordion-button collapsed" ||
//     event.target.className === "accordion-button"
//   ) {
//     event.preventDefault();
//     console.log("yess");
//   } else if (event.target.className === "fas fa-plus-circle add-a") {
//     const id = event.dataTransfer.getData("text");
//     let second = document.getElementById(id + "b").value.replace(/\"/g, "");
//     let parrentId = event.target.parentNode.id;
//     let inputId = parrentId.slice(0, -1);
//     let first = event.target.parentElement.value.replace(/\"/g, "");
//     let newKeyword = first + " " + second;
//     console.log(newKeyword);

//     let html =
//       '<input style="display: none;" type="text" name="cat" id="' +
//       inputId +
//       'i" value="' +
//       newKeyword +
//       '" >' +
//       '<div class="accordion-item" id="cat">' +
//       '<h2 class="accordion-header" id="headingTwo"> <button value ="' +
//       newKeyword +
//       '" id="' +
//       parrentId +
//       '" name ="category"' +
//       'class="accordion-button collapsed" type="button"' +
//       'data-bs-toggle="collapse" data-bs-target="#' +
//       parrentId +
//       't"' +
//       'aria-expanded="false" aria-controls="' +
//       parrentId +
//       't">' +
//       '<i id="add-b" class="fas fa-plus-circle add-b"' +
//       'style="padding: 10px;"></i>' +
//       " " +
//       newKeyword +
//       '<i onclick="addAf(this)" id="bb"' +
//       'class="fas fa-plus-circle add-a" style="padding: 10px;"' +
//       ' ondragover="onDragOver(event);" ondrop="onDrop(event);"></i>' +
//       '<i class="fas fa-minus-circle" style="padding: 10px;"  onclick="delKey(this)"></i>' +
//       "<br>" +
//       '<i class="fas fa-pen" style="padding: 10px;"' +
//       '  onclick="editKey(this)"></i>';
//     ("</button></h2>");

//     const draggableElement = document.getElementById(id);
//     const dropzone = event.target;
//     let test = parrentId.slice(0, -1);
//     document.getElementById(test).innerHTML = html;

//     dropzone.appendChild(draggableElement);
//     event.dataTransfer.clearData();
//   } else if (event.target.className === "fas fa-plus-circle add-b") {
//     const id = event.dataTransfer.getData("text");
//     let second = document.getElementById(id + "b").value.replace(/\"/g, "");
//     let parrentId = event.target.parentNode.id;
//     let inputId = parrentId.slice(0, -1);
//     let first = event.target.parentElement.value.replace(/\"/g, "");
//     let newKeyword = second + " " + first;
//     console.log("parrentid  ",parrentId, " ", document.getElementById(parrentId                                                                                                                                                                                                                                 ))
//     console.log("inputid  ",inputId, " ", document.getElementById(inputId))

//     let html =
//       '<input style="display: none;" type="text" name="cat" id="' +
//       inputId +
//       'i" value="' +
//       newKeyword +
//       '" >' +
//       '<div class="accordion-item" id="keyword">' +
//       '<h2 class="accordion-header" id="headingTwo"> <button value ="' +
//       newKeyword +
//       '" id="' +
//       parrentId +
//       '" name ="category"' +
//       'class="accordion-button collapsed" type="button"' +
//       'data-bs-toggle="collapse" data-bs-target="#' +
//       parrentId +
//       't"' +
//       'aria-expanded="false" aria-controls="' +
//       parrentId +
//       't">' +
//       '<i id="add-b" class="fas fa-plus-circle add-b"' +
//       'style="padding: 10px;"></i>' +
//       " " +
//       newKeyword +
//       '<i onclick="addAf(this)" id="bb"' +
//       'class="fas fa-plus-circle add-a" style="padding: 10px;"' +
//       ' ondragover="onDragOver(event);" ondrop="onDrop(event);"></i>' +
//       '<i class="fas fa-minus-circle" style="padding: 10px;"  onclick="delKey(this)"></i>' +
//       "<br>" +
//       '<i class="fas fa-pen" style="padding: 10px;"' +
//       '  onclick="editKey(this)"></i>';
//     ("</button></h2>");

//     const draggableElement = document.getElementById(id);
//     const dropzone = event.target;
//     let test = parrentId.slice(0, -1);
//     document.getElementById(test).innerHTML = html;

//     dropzone.appendChild(draggableElement);
//     event.dataTransfer.clearData();
//   } else if(event.target.className === 'list list2'){
//     const id = event.dataTransfer.getData("text");
//     const draggableElement = document.getElementById(id);
//     const dropzone = event.target;
//     dropzone.appendChild(draggableElement);
//     event.dataTransfer.clearData();
//     console.log(test);
//   }else {
//     event.preventDefault()
//   }
// }

// function editKey(data) {
//   console.log(data.parentElement.value);
//   $(".modal").modal("show");

//   document.getElementById("modal-input").value = data.parentElement.value;
//   document
//     .getElementById("modal-input")
//     .setAttribute("name", data.parentElement.id);
// }

// $("#modal-save").click((e) => {
//   let data = document.getElementById("modal-input").value;
//   console.log(data);
//   let id = document.getElementById("modal-input").name;
//   console.log(id);
//   let inputId = id.slice(0, -1);

//   // let id2 = id.slice(0, -1)
//   // // $('#'+id).attr('value', 'Save');
//   // let t = document.getElementById(id)
//   // console.log(t)
//   html =
//     '<i id="add-b" class="fas fa-plus-circle add-b"' +
//     'style="padding: 10px;"></i>' +
//     " " +
//     data +
//     '<i onclick="addAf(this)" id="bb"' +
//     'class="fas fa-plus-circle add-a" style="padding: 10px;"' +
//     ' ondragover="onDragOver(event);" ondrop="onDrop(event);"></i>' +
//     '<i class="fas fa-minus-circle" style="padding: 10px;"  onclick="delKey(this)"></i>' +
//     "<br>" +
//     '<i class="fas fa-pen" style="padding: 10px;"' +
//     '  onclick="editKey(this)"></i>';

//   document.getElementById(id).innerHTML = html;
//   document.getElementById(id).value = data;
//   document.getElementById(inputId + "i").value = data;
//   $(".modal").modal("hide");
// });

// $("#modal-close").click(() => $(".modal").modal("hide"));

// function delKey(data) {
//   console.log(data)
//   console.log('button clicked')
//   let id = data.parentElement.id.slice(0, -1);
//   console.log(id);
//   var el = document.getElementById(id);
//   el.parentNode.removeChild(el);
// }

function onDragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
  event.dataTransfer.effectAllowed = "copy";
}

function onDragOver(event) {
  event.preventDefault();
}

let count = 1;

function onDrop(event) {
  const dropzone = event.target;
  console.log(dropzone);
  event.target.style.backgroundColor = "#ededed";
  if (dropzone.className === "list list2") {
    const id = event.dataTransfer.getData("text");
    const draggableElement = document.getElementById(id);
    if (draggableElement.className === "example-draggable edited") {
      dropzone.appendChild(draggableElement);

      ///changing style of edit and delete tag

      document.getElementById("e" + draggableElement.id).style.display =
        "inline";
      document.getElementById("d" + draggableElement.id).style.display =
        "inline";
      event.dataTransfer.clearData();

      ///remove from db
      let editedKeyword = document
        .getElementById(draggableElement.id)
        .getAttribute("data-value");
      flushEdited(editedKeyword);
    } else {
      //cloning
      const id = event.dataTransfer.getData("text");
      const draggableElement = document.getElementById(id).cloneNode(true);

      //sorting
      let editedKeyword = document
        .getElementById(draggableElement.id)
        .getAttribute("data-value");
      let isKey = sorting(editedKeyword);
      if (isKey === true) {
        //changing background color
        draggableElement.style.backgroundColor = "#fda38b";
        draggableElement.childNodes[1].name = "duplicate"; //change name for sorting

        document.getElementById(draggableElement.id).id =
          draggableElement.id + count;
        document.getElementById("e" + draggableElement.id).id =
          "e" + draggableElement.id + count;
        document.getElementById("d" + draggableElement.id).id =
          "d" + draggableElement.id + count;
        dropzone.appendChild(draggableElement);

        ///changing style of edit and delete tag

        document.getElementById("e" + draggableElement.id).style.display =
          "inline";
        document.getElementById("d" + draggableElement.id).style.display =
          "inline";
        event.dataTransfer.clearData();
        count += 1;
      } else {
        //to change id of element
        document.getElementById(draggableElement.id).id =
          draggableElement.id + count;
        document.getElementById("e" + draggableElement.id).id =
          "e" + draggableElement.id + count;
        document.getElementById("d" + draggableElement.id).id =
          "d" + draggableElement.id + count;
        dropzone.appendChild(draggableElement);

        ///changing style of edit and delete tag

        document.getElementById("e" + draggableElement.id).style.display =
          "inline";
        document.getElementById("d" + draggableElement.id).style.display =
          "inline";
        event.dataTransfer.clearData();
        count += 1;
      }
    }
  } else if (dropzone.className === "fas fa-download add-a") {
    const id = event.dataTransfer.getData("text");
    const parrentId = dropzone.parentElement.parentElement.id;
    const firstValue = dropzone.parentElement.value;
    let secondId = id.split("-")[0].replace(/-/g, "");
    const secondValue = document.getElementById(secondId + "i").value;
    const keyword = firstValue + " " + secondValue.trim();

    //keyword exist

    let isKey = sorting(keyword);
    if (isKey === true) {
      let html =
        '<input type="text" value="' +
        keyword +
        '" name="dupicate" id="' +
        parrentId +
        'i" style="display: none;">' +
        '<button value="' +
        keyword +
        '" style="all: unset;" id="' +
        parrentId +
        'b">' +
        '<i id="add-b" class="fas fa-download add-b" onclick="pre(event)" style="padding: 13px 30px 13px 30px; font-size:17px;"></i>' +
        "" +
        keyword +
        '<i id="' +
        parrentId +
        '-a" ' +
        'class="fas fa-download add-a" onclick="pre(event)" style="padding: 13px 30px 13px 30px; font-size:17px;"' +
        'ondragover="onDragOver(event);" ondrop="onDrop(event);"></i>' +
        '<i class="fas fa-pen-square" style="padding: 13px 30px 13px 152px; cursor: pointer;font-size:17px;" onclick="editKeyword(event,this)"></i>' +
        '  <i class="fas fa-trash" style="padding: 10px;cursor: pointer;"' +
        'onclick="delKey(event,this)" id="' +
        parrentId +
        'd"></i>' +
        "</button>";
      document.getElementById(parrentId).style.backgroundColor = "#f79a71";
      document.getElementById(parrentId).innerHTML = html;
    } else {
      let html =
        '<input type="text" value="' +
        keyword +
        '" name="cat" id="' +
        parrentId +
        'i" style="display: none;">' +
        '<button value="' +
        keyword +
        '" style="all: unset;" id="' +
        parrentId +
        'b">' +
        '<i id="add-b" class="fas fa-download add-b" onclick="pre(event)" style="padding: 13px 30px 13px 30px; font-size:17px;"></i>' +
        "" +
        keyword +
        '<i id="' +
        parrentId +
        '-a" ' +
        'class="fas fa-download add-a" onclick="pre(event)" style="padding: 13px 30px 13px 30px; font-size:17px;"' +
        'ondragover="onDragOver(event);" ondrop="onDrop(event);"></i>' +
        '<i class="fas fa-pen-square" style="padding: 13px 30px 13px 152px; font-size:17px;cursor: pointer;" onclick="editKeyword(event,this)"></i>' +
        '  <i class="fas fa-trash" style="padding: 10px;cursor: pointer;"' +
        'onclick="delKey(event,this)" id="' +
        parrentId +
        'd"></i>' +
        "</button>";

      document.getElementById(parrentId).style.backgroundColor =
        "rgb(223 227 226 / 77%)";
      document.getElementById(parrentId).innerHTML = html;
    }
  } else if (dropzone.className === "fas fa-download add-b") {
    const id = event.dataTransfer.getData("text");
    const parrentId = dropzone.parentElement.parentElement.id;
    const firstValue = dropzone.parentElement.value;
    let secondId = id.split("-")[0].replace(/-/g, "");
    const secondValue = document.getElementById(secondId + "i").value;
    const keyword = secondValue + " " + firstValue.trim();

    let html =
      '<input type="text" name="duplicate" value="' +
      keyword +
      '" id="' +
      parrentId +
      'i" style="display: none;">' +
      '<button value="' +
      keyword +
      '" style="all: unset;" id="' +
      parrentId +
      'b">' +
      '<i id="add-b" class="fas fa-download add-b" onclick="pre(event)" style="padding: 13px 30px 13px 30px; font-size:17px;"></i>' +
      "" +
      keyword +
      '<i id="' +
      parrentId +
      '-a" ' +
      'class="fas fa-download add-a" onclick="pre(event)" style="padding: 13px 30px 13px 30px; font-size:17px;"' +
      'ondragover="onDragOver(event);" ondrop="onDrop(event);"></i>' +
      '<i class="fas fa-pen-square" style="padding: 13px 30px 13px 152px; font-size:17px;cursor: pointer;" onclick="editKeyword(event,this)"></i>' +
      '<i class="fas fa-trash" style="padding: 10px;cursor: pointer;"' +
      'onclick="delKey(event,this)" id="' +
      parrentId +
      'd"></i>' +
      "</button>";

    let isKey = sorting(keyword);
    if (isKey === true) {
      document.getElementById(parrentId).style.backgroundColor = "#f79a71";
      document.getElementById(parrentId).innerHTML = html;
    } else {
      document.getElementById(parrentId).style.backgroundColor =
        "rgb(223 227 226 / 77%)";
      document.getElementById(parrentId).innerHTML = html;
    }
  } else {
    event.preventDefault();
  }
}

function editKeyword(e, data) {
  e.preventDefault();
  let parrentId = data.parentElement.parentElement.id;

  $(".modal").modal("show");
  document.getElementById("modal-input").value = data.parentElement.value;
  document.getElementById("modal-input").name = parrentId;
}

$("#modal-save").click((e) => {
  let editedData = document.getElementById("modal-input").value.trim();
  let parrentId = document.getElementById("modal-input").name;

  let isKey = sorting(editedData);
  if (isKey === true) {
    let html =
      '<input type="text" name="duplicate" value="' +
      editedData +
      '" id="' +
      parrentId +
      'i" style="display: none;">' +
      '<button value="' +
      editedData +
      '" style="all: unset;" id="' +
      parrentId +
      'b">' +
      '<i id="add-b" class="fas fa-download add-b" onclick="pre(event)" style="padding: 13px 30px 13px 30px; font-size:17px;"></i>' +
      "" +
      editedData +
      '<i id="' +
      parrentId +
      '-a" ' +
      'class="fas fa-download add-a" onclick="pre(event)" style="padding: 13px 30px 13px 30px; font-size:17px;"' +
      'ondragover="onDragOver(event);" ondrop="onDrop(event);"></i>' +
      ' <i class="fas fa-pen-square" style="padding: 13px 30px 13px 152px; font-size:17px;cursor: pointer;" onclick="editKeyword(event,this)"></i>' +
      '<i class="fas fa-trash" style="padding: 10px;cursor:pointer"' +
      'onclick="delKey(event,this)" id="' +
      parrentId +
      'd"></i>' +
      "</button>";

    document.getElementById(parrentId).style.backgroundColor = "#f79a71";
    document.getElementById(parrentId).innerHTML = html;
    $(".modal").modal("hide");
  } else {
    let html =
      '<input type="text" name="cat" value="' +
      editedData +
      '" id="' +
      parrentId +
      'i" style="display: none;">' +
      '<button value="' +
      editedData +
      '" style="all: unset;" id="' +
      parrentId +
      'b">' +
      '<i id="add-b" class="fas fa-download add-b" onclick="pre(event)" style="padding: 13px 30px 13px 30px; font-size:17px;"></i>' +
      "" +
      editedData +
      '<i id="' +
      parrentId +
      '-a" ' +
      'class="fas fa-download add-a" onclick="pre(event)" style="padding: 13px 30px 13px 30px; font-size:17px;"' +
      'ondragover="onDragOver(event);" ondrop="onDrop(event);"></i>' +
      ' <i class="fas fa-pen-square" style="padding: 13px 30px 13px 152px; font-size:17px;cursor: pointer;" onclick="editKeyword(event,this)"></i>' +
      '<i class="fas fa-trash" style="padding: 10px;cursor:pointer"' +
      'onclick="delKey(event,this)" id="' +
      parrentId +
      'd"></i>' +
      "</button>";

    document.getElementById(parrentId).style.backgroundColor =
      "rgb(223 227 226 / 77%)";
    document.getElementById(parrentId).innerHTML = html;
    $(".modal").modal("hide");
  }
});

$("#modal-close").click(() => $(".modal").modal("hide"));

function delKey(event, data) {
  event.preventDefault();
  let id = data.parentElement.parentElement.id;
  var el = document.getElementById(id);
  el.parentNode.removeChild(el);
}

$("#relation-form").submit((e) => {
  e.preventDefault();

  let data = $("#relation-form").serializeArray();

  if (data.length === 0) {
    alert("no data to submit");
  } else {
    $.ajax({
      url: "submit-keyword",
      type: "post",
      data: data,
      success: (response) => {
        if (response === true) {
          $("#afteruploadmsg")
            .html("added succes")
            .css("color", "green")
            .show();
          // $("#afteruploadmsg").delay(1000).hide(0);
          alert("successfully submitted");
          $("#list2").empty();
          $("#edited").load(location.href + " #edited");
          $("#key-count").load(location.href + " #key-count");
        }
      },
    });
  }
  return false;
});

function flushEdited(keyword) {
  $.ajax({
    url: "flush-keyword",
    type: "post",
    data: {
      keyword,
    },
  });
}

function sorting(keyword) {
  let key;
  $.ajax({
    url: "key-exist",
    type: "post",
    async: false,
    data: {
      keyword,
    },
    success: (response) => {
      key = response;
    },
  });

  return key;
}

function pre(event) {
  event.preventDefault();
}

///////reset password
$("#reset-password").click((e) => {
  const email = document.getElementById("email").value;
  e.preventDefault();
  if (!email) {
    alert("enter email to continue");
  } else {
    $.ajax({
      url: "/reset-password",
      type: "post",
      data: {
        email,
      },
      success: (response) => {
        if (response === "no-user") {
          alert("no user found");
        } else if (response === "wrong") {
          alert("something went wrong");
        } else if (response === "submited") {
          alert("password will send shortly");
        }
      },
    });
  }
});

// let timerOn = true;

// function timer(remaining) {
//   var m = Math.floor(remaining / 60);
//   var s = remaining % 60;

//   m = m < 10 ? '0' + m : m;
//   s = s < 10 ? '0' + s : s;
//   document.getElementById('timer').innerHTML = m + ':' + s;
//   remaining -= 1;

//   if(remaining >= 0 && timerOn) {
//     setTimeout(function() {
//         timer(remaining);
//     }, 1000);
//     return;
//   }

//   if(!timerOn) {
//     // Do validate stuff here
//     return;
//   }

//   // Do timeout stuff here
//   alert('Timeout for otp');
// }

// timer(120);

function resetPasswordAprovel(event) {
  event.preventDefault();
  let status = event.target.value;
  let id = event.target.id;
  $.ajax({
    url: "/update-reset-password",
    type: "post",
    data: {
      status,
      id,
    },
    success: (response) => {
      if (!response) {
        alert("something wrong");
      } else {
        $("#reset-password-approvel").load(
          location.href + " #reset-password-approvel"
        );
      }
    },
  });
}
