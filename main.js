let res;
let apiSrv = window.location.pathname;
let password_value = document.querySelector("#passwordText").value;
let buildValueItemFunc = buildValueTxt;

function shorturl() {
  if (document.querySelector("#longURL").value == "") {
    alert("Url cannot be empty!");
    return;
  }

  // key can't have space in it
  document.getElementById('keyPhrase').value = document.getElementById('keyPhrase').value.replace(/\s/g, "-");

  document.getElementById("addBtn").disabled = true;
  document.getElementById("addBtn").innerHTML = 'tinifying...';
  document.getElementById('result').addEventListener('click', async () => {
    const text = document.getElementById('generatedLink').textContent;
    const alertBox = document.getElementById('copyAlert');

    try {
      await navigator.clipboard.writeText(text);
      alertBox.style.display = 'block';
      alertBox.style.animation = 'none';
      void alertBox.offsetHeight; // 触发重绘
      alertBox.style.animation = 'fadeOut 2.5s forwards';
    } catch (err) {
      alertBox.textContent = "❌ Copy failed.";
      alertBox.style.display = 'block';
      alertBox.style.animation = 'none';
      void alertBox.offsetHeight;
      alertBox.style.animation = 'fadeOut 2.5s forwards';

      // 自动选择文本作为降级方案
      const range = document.createRange();
      range.selectNodeContents(document.getElementById('generatedLink'));
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }
  });
  let longURL = document.querySelector("#longURL").value;
  let keyPhrase = document.querySelector("#keyPhrase").value;
  fetch(apiSrv, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cmd: "add", url: longURL, key: keyPhrase, password: password_value })
  }).then(function (response) {
    return response.json();
  }).then(function (myJson) {
    res = myJson;
    document.getElementById("addBtn").disabled = false;
    document.getElementById("addBtn").innerHTML = 'tinify';

    // 成功生成短链 Succeed
    if (res.status == "200") {
      document.getElementById("longURL").value = "";
      document.getElementById("keyPhrase").value = "";
      const resultDiv = document.getElementById('result');
      const linkDisplay = document.getElementById('generatedLink');
      let tinyLink = apiSrv + keyPhrase;
      linkDisplay.textContent = tinyLink;
      resultDiv.style.display = 'block';
      navigator.clipboard.writeText(tinyLink);
      alert("Success, tiny link copied.");
    } else {
      alert("Failed: " + res.msg);
    }

  }).catch(function (err) {
    alert("Unknow error. Please retry!");
    console.log(err);
    document.getElementById("addBtn").disabled = false;
    document.getElementById("addBtn").innerHTML = 'tinify';
  })
}
