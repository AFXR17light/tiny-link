let res

let apiSrv = window.location.pathname
let password_value = document.querySelector("#passwordText").value
// let apiSrv = "https://journal.crazypeace.workers.dev"
// let password_value = "journaljournal"

// 这是默认行为, 在不同的index.html中可以设置为不同的行为
// This is default, you can define it to different funciton in different theme index.html
let buildValueItemFunc = buildValueTxt

function shorturl() {
  if (document.querySelector("#longURL").value == "") {
    alert("Url cannot be empty!")
    return
  }

  // key can't have space in it
  document.getElementById('keyPhrase').value = document.getElementById('keyPhrase').value.replace(/\s/g, "-");

  document.getElementById("addBtn").disabled = true;
  document.getElementById("addBtn").innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Please wait...';
  fetch(apiSrv, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cmd: "add", url: document.querySelector("#longURL").value, key: document.querySelector("#keyPhrase").value, password: password_value })
  }).then(function (response) {
    return response.json();
  }).then(function (myJson) {
    res = myJson;
    document.getElementById("addBtn").disabled = false;
    document.getElementById("addBtn").innerHTML = 'tinify';

    // 成功生成短链 Succeed
    if (res.status == "200") {
      alert("success");
      document.getElementById("longURL").value = "";
      document.getElementById("keyPhrase").value = "";
    } else {
      alert(res.message);
    }

  }).catch(function (err) {
    alert("Unknow error. Please retry!");
    console.log(err);
    document.getElementById("addBtn").disabled = false;
    document.getElementById("addBtn").innerHTML = 'tinify';
  })
}
