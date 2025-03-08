let res;
let apiSrv = window.location.pathname;
let password_value = document.querySelector("#passwordText").value;
let buildValueItemFunc = buildValueTxt;

function showAlert(message, duration = 2000) {
  console.log(message);
  const alertBox = document.getElementById('alert');
  // 清除现有定时器
  if(alertBox.timer) clearTimeout(alertBox.timer);
  // 设置新内容
  alertBox.textContent = message;
  // 显示提示
  alertBox.classList.add('show');
  // 设置自动隐藏
  alertBox.timer = setTimeout(() => {
    alertBox.classList.remove('show');
  }, duration);
}

async function checkURL(URL) {
  let str = URL;
  let Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
  let objExp = new RegExp(Expression);
  if (objExp.test(str) == true) {
    if (str[0] == 'h')
      return true;
    else
      return false;
  } else {
    return false;
  }
}

function shorturl() {
  if (document.querySelector("#longURL").value == "") {
    showAlert("❌ Url cannot be empty!");
    return;
  } else if (!checkURL(document.querySelector("#longURL").value)) {
    showAlert("❌ Invalid URL!");
    return;
  }

  // key can't have space in it
  document.getElementById('keyPhrase').value = document.getElementById('keyPhrase').value.replace(/\s/g, "-");

  document.getElementById("addBtn").disabled = true;
  document.getElementById("addBtn").innerHTML = 'tinifying...';
  document.getElementById('result').addEventListener('click', async () => {
    const text = document.getElementById('generatedLink').textContent;
    const alertBox = document.getElementById('alert');

    try {
      await navigator.clipboard.writeText(text);
      showAlert('✓ Copied');
    } catch (err) {
      showAlert('❌ Copy failed');

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
      let tinyLink = window.location.hostname + '/' + keyPhrase;
      linkDisplay.textContent = tinyLink;
      resultDiv.style.display = 'block';
      navigator.clipboard.writeText(tinyLink);
      showAlert("✓ Success, tiny link copied.");
    } else {
      showAlert("❌ " + res.msg);
    }

  }).catch(function (err) {
    showAlert("❌ Unknow error");
    console.log(err);
    document.getElementById("addBtn").disabled = false;
    document.getElementById("addBtn").innerHTML = 'tinify';
  })
}
