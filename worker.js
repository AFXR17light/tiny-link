const config = {
  password: "", // 管理面板使用密码 // if password != null, then use this config; otherwise, read password from KV.
  result_page: false, // 是否用特定的result页面来显示value // After get the value from KV, if use a page to show the result.
  theme: "", // 管理面板的主题 // Homepage theme, use the empty value for default theme. To use urlcool theme, please fill with "theme/urlcool" .
  cors: true, // 是否允许CORS使用API // Allow Cross-origin resource sharing for API requests.
  unique_link: false, // 一个长链是否只有唯一的短链(会增加写入的使用量) // If it is true, the same long url will be shorten into the same short url
  custom_link: true, // 允许自定义短链 // Allow users to customize the short url.
  overwrite_kv: false, // 允许覆盖已存在的key // Allow user to overwrite an existed key.
  snapchat_mode: false, // 短链只能访问一次(访问后就删除了) // The link will be distroyed after access.
  visit_count: false, // 使用记数(会大大增加写入的使用量, 多人共用不推荐打开) // Count visit times.
  load_kv: false, // 从KV加载全部数据(自用推荐打开, 多人共用会看到别人的数据) // Load all from Cloudflare KV
  system_type: "shorturl", // 系统的功能定义 // shorturl, imghost, other types {pastebin, journal}
}

// key in protect_keylist can't read, add, del from UI and API
const protect_keylist = [
  "password",
]

let index_html = "https://afxr17light.github.io/tiny-link/" + config.theme + "/index.html"
let result_html = "https://afxr17light.github.io/tiny-link/" + config.theme + "/result.html"

const html404 = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>(๑• . •๑) ?</title>
  <style>
    :root {
      --bg-color: #f8f9fa;
      --text-color: #2d3436;
      --container-bg: #ffffff;
      --shadow-color: rgba(0, 0, 0, 0.1);
      --primary-color: #e84393;
      --primary-hover: #d6336c;
      --secondary-text: #636e72;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg-color: #1a1a1a;
        --text-color: #e0e0e0;
        --container-bg: #2d2d2d;
        --shadow-color: rgba(0, 0, 0, 0.3);
        --primary-color: #ff79b0;
        --primary-hover: #ff5c9c;
        --secondary-text: #a0a0a0;
      }
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    body {
      background: var(--bg-color);
      color: var(--text-color);
      line-height: 1.6;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      text-align: center;
      transition: background 0.3s ease, color 0.3s ease;
    }

    .container {
      max-width: 600px;
      width: 100%;
      padding: 2rem;
      background: var(--container-bg);
      border-radius: 12px;
      box-shadow: 0 4px 6px var(--shadow-color);
      margin: 1rem;
      transition: background 0.3s ease;
    }

    h1 {
      color: var(--primary-color);
      font-size: clamp(2rem, 5vw, 3rem);
      margin-bottom: 1rem;
    }

    p {
      font-size: clamp(1rem, 2.5vw, 1.25rem);
      color: var(--secondary-text);
      margin-bottom: 2rem;
    }

    .tinyko {
      font-size: 2.5rem;
      margin: 1rem 0;
      filter: brightness(1.1);
    }

    .back-link {
      display: inline-block;
      padding: 0.8rem 1.5rem;
      background: var(--primary-color);
      color: white;
      text-decoration: none;
      border-radius: 25px;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    .back-link:hover {
      background: var(--primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 480px) {
      body {
        padding: 1rem;
      }
      .container {
        padding: 1.5rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Page not found</h1>
    <div class="tinyko">(๑• . •๑) ?</div>
    <p>Oops! The page you're looking for is tinier than expected!</p>
  </div>
</body>
</html>`;

const htmlHome = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>(๑• . •๑)</title>
  <style>
    :root {
      --bg-color: #f8f9fa;
      --text-color: #2d3436;
      --container-bg: #ffffff;
      --shadow-color: rgba(0, 0, 0, 0.1);
      --primary-color: #e84393;
      --primary-hover: #d6336c;
      --secondary-text: #636e72;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg-color: #1a1a1a;
        --text-color: #e0e0e0;
        --container-bg: #2d2d2d;
        --shadow-color: rgba(0, 0, 0, 0.3);
        --primary-color: #ff79b0;
        --primary-hover: #ff5c9c;
        --secondary-text: #a0a0a0;
      }
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    body {
      background: var(--bg-color);
      color: var(--text-color);
      line-height: 1.6;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      text-align: center;
      transition: background 0.3s ease, color 0.3s ease;
    }

    .container {
      max-width: 600px;
      width: 100%;
      padding: 2rem;
      background: var(--container-bg);
      border-radius: 12px;
      box-shadow: 0 4px 6px var(--shadow-color);
      margin: 1rem;
      transition: background 0.3s ease;
    }

    h1 {
      color: var(--primary-color);
      font-size: clamp(2rem, 5vw, 3rem);
      margin-bottom: 1rem;
    }

    p {
      font-size: clamp(1rem, 2.5vw, 1.25rem);
      color: var(--secondary-text);
      margin-bottom: 2rem;
    }

    .tinyko {
      font-size: 2.5rem;
      margin: 1rem 0;
      filter: brightness(1.1);
    }

    .back-link {
      display: inline-block;
      padding: 0.8rem 1.5rem;
      background: var(--primary-color);
      color: white;
      text-decoration: none;
      border-radius: 25px;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    .back-link:hover {
      background: var(--primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 480px) {
      body {
        padding: 1rem;
      }
      .container {
        padding: 1.5rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>tiny link service</h1>
    <div class="tinyko">(๑• . •๑)</div>
    <p>Private URL shortening infrastructure, not publicly accessible.</p>
  </div>
</body>
</html>`;

let response_header = {
  "Content-type": "text/html;charset=UTF-8;application/json",
}

if (config.cors) {
  response_header = {
    "Content-type": "text/html;charset=UTF-8;application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type",
  }
}

function base64ToBlob(base64String) {
  var parts = base64String.split(';base64,');
  var contentType = parts[0].split(':')[1];
  var raw = atob(parts[1]);
  var rawLength = raw.length;
  var uInt8Array = new Uint8Array(rawLength);
  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
}

async function randomString(len) {
  len = len || 6;
  let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /*去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1 *** Easily confused characters removed */
  let maxPos = chars.length;
  let result = '';
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

async function sha512(url) {
  url = new TextEncoder().encode(url)

  const url_digest = await crypto.subtle.digest(
    {
      name: "SHA-512",
    },
    url, // The data you want to hash as an ArrayBuffer
  )
  const hashArray = Array.from(new Uint8Array(url_digest)); // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  //console.log(hashHex)
  return hashHex
}

async function checkURL(url) {
  // 允许省略协议的常见情况
  if (!url.startsWith('http')) {
    url = `https://${url}`;
  }
  
  try {
    new URL(url);
    return /^https?:\/\/([\w-]+\.)+[\w-]+/.test(url);
  } catch {
    return false;
  }
}

async function save_url(URL) {
  let random_key = await randomString()
  let is_exist = await LINKS.get(random_key)
  // console.log(is_exist)
  if (is_exist == null) {
    return await LINKS.put(random_key, URL), random_key
  }
  else {
    save_url(URL)
  }
}

async function is_url_exist(url_sha512) {
  let is_exist = await LINKS.get(url_sha512)
  // console.log(is_exist)
  if (is_exist == null) {
    return false
  } else {
    return is_exist
  }
}

// 系统密码
async function system_password() {
  // 配置中的passoword为空 config.password is NULL
  if (config.password.trim().length === 0 ) {    
    // 查KV中的password对应的值 Query "password" in KV
    return await LINKS.get("password");
  }
  else {
    return config.password.trim();
  }
}

async function handleRequest(request) {
  // console.log(request)

  // 系统密码
  const password_value  = await system_password();
  
  /************************/
  // 以下是API接口的处理 Below is operation for API

  if (request.method === "POST") {
    let req = await request.json()
    // console.log(req)

    let req_cmd = req["cmd"]
    let req_url = req["url"]
    let req_key = req["key"]
    let req_password = req["password"]

    /*
    console.log(req_cmd)
    console.log(req_url)
    console.log(req_key)
    console.log(req_password)
    */

    if (req_password != password_value) {
      return new Response(`{"status":500,"key": "", "error":"Error: Invalid password."}`, {
        headers: response_header,
      })
    }

    if (req_cmd == "add") {
      if ((config.system_type == "shorturl") && !await checkURL(req_url)) {
        return new Response(`{"status":500, "url": "` + req_url + `", "error":"Error: Url illegal."}`, {
          headers: response_header,
        })
      }

      let stat, random_key
      if (config.custom_link && (req_key != "")) {
        // Refuse 'password" as Custom shortURL
        if (protect_keylist.includes(req_key)) {
          return new Response(`{"status":500,"key": "` + req_key + `", "error":"Error: Key in protect_keylist."}`, {
            headers: response_header,
          })
        }

        let is_exist = await is_url_exist(req_key)
        if ((!config.overwrite_kv) && (is_exist)) {
          return new Response(`{"status":500,"key": "` + req_key + `", "error":"tail exists"}`, {
            headers: response_header,
          })
        } else {
          random_key = req_key
          stat, await LINKS.put(req_key, req_url)
        }
      } else if (config.unique_link) {
        let url_sha512 = await sha512(req_url)
        let url_key = await is_url_exist(url_sha512)
        if (url_key) {
          random_key = url_key
        } else {
          stat, random_key = await save_url(req_url)
          if (typeof (stat) == "undefined") {
            await LINKS.put(url_sha512, random_key)
            // console.log()
          }
        }
      } else {
        stat, random_key = await save_url(req_url)
      }
      // console.log(stat)
      if (typeof (stat) == "undefined") {
        return new Response(`{"status":200, "key":"` + random_key + `", "error": ""}`, {
          headers: response_header,
        })
      } else {
        return new Response(`{"status":500, "key": "", "error":"Error: Reach the KV write limitation."}`, {
          headers: response_header,
        })
      }
    } else if (req_cmd == "del") {
      // Refuse to delete 'password' entry
      if (protect_keylist.includes(req_key)) {
        return new Response(`{"status":500, "key": "` + req_key + `", "error":"Error: Key in protect_keylist."}`, {
          headers: response_header,
        })
      }

      await LINKS.delete(req_key)
      
      // 计数功能打开的话, 要把计数的那条KV也删掉 Remove the visit times record
      if (config.visit_count) {
        await LINKS.delete(req_key + "-count")
      }

      return new Response(`{"status":200, "key": "` + req_key + `", "error": ""}`, {
        headers: response_header,
      })
    } else if (req_cmd == "qry") {
      // Refuse to query 'password'
      if (protect_keylist.includes(req_key)) {
        return new Response(`{"status":500,"key": "` + req_key + `", "error":"Error: Key in protect_keylist."}`, {
          headers: response_header,
        })
      }

      let value = await LINKS.get(req_key)
      if (value != null) {
        let jsonObjectRetrun = JSON.parse(`{"status":200, "error":"", "key":"", "url":""}`);
        jsonObjectRetrun.key = req_key;
        jsonObjectRetrun.url = value;
        return new Response(JSON.stringify(jsonObjectRetrun), {
          headers: response_header,
        })
      } else {
        return new Response(`{"status":500, "key": "` + req_key + `", "error":"Error: Key not exist."}`, {
          headers: response_header,
        })
      }
    } else if (req_cmd == "qryall") {
      if ( !config.load_kv) {
        return new Response(`{"status":500, "error":"Error: Config.load_kv false."}`, {
          headers: response_header,
        })
      }

      let keyList = await LINKS.list()
      if (keyList != null) {
        // 初始化返回数据结构 Init the return struct
        let jsonObjectRetrun = JSON.parse(`{"status":200, "error":"", "kvlist": []}`);
                
        for (var i = 0; i < keyList.keys.length; i++) {
          let item = keyList.keys[i];
          // Hide 'password' from the query all result
          if (protect_keylist.includes(item.name)) {
            continue;
          }
          // Hide '-count' from the query all result
          if (item.name.endsWith("-count")) {
            continue;
          }

          let url = await LINKS.get(item.name);
          
          let newElement = { "key": item.name, "value": url };
          // 填充要返回的列表 Fill the return list
          jsonObjectRetrun.kvlist.push(newElement);
        }

        return new Response(JSON.stringify(jsonObjectRetrun) , {
          headers: response_header,
        })
      } else {
        return new Response(`{"status":500, "error":"Error: Load keyList failed."}`, {
          headers: response_header,
        })
      }

    }

  } else if (request.method === "OPTIONS") {
    return new Response(``, {
      headers: response_header,
    })
  }

  /************************/
  // 以下是浏览器直接访问worker页面的处理 Below is operation for browser visit worker page

  const requestURL = new URL(request.url)
  let path = requestURL.pathname.split("/")[1]
  path = decodeURIComponent(path);
  const params = requestURL.search;

  // console.log(path)
  // 如果path为空, 即直接访问本worker
  // If visit this worker directly (no path)
  if (!path) {
    return new Response(htmlHome, {
      headers: response_header,
      status: 200
    }) 
  }

  // 如果path符合password 显示操作页面index.html
  // if path equals password, return index.html
  if (path == password_value) {
    let index = await fetch(index_html)
    index = await index.text()
    index = index.replace(/__PASSWORD__/gm, password_value)
    // 操作页面文字修改
    // index = index.replace(/短链系统变身/gm, "")
    return new Response(index, {
      headers: response_header,
    })
  }

  // 在KV中查询 短链接 对应的原链接
  // Query the value(long url) in KV by key(short url)
  let value = await LINKS.get(path);
  // console.log(value)

  // 如果path是'password', 让查询结果为空, 不然直接就把password查出来了
  // Protect password. If path equals 'password', set result null
  if (protect_keylist.includes(path)) {
    value = ""
  }

  if (!value) {
    // KV中没有数据, 返回404
    // If request not in KV, return 404
    return new Response(html404, {
      headers: response_header,
      status: 404
    })
  }

  // 计数功能
  if (config.visit_count) {
    // 获取并增加访问计数
    let count = await LINKS.get(path + "-count");
    if (count === null) {
      await LINKS.put(path + "-count", "1"); // 初始化为1，因为这是首次访问
    } else {
      count = parseInt(count) + 1;
      await LINKS.put(path + "-count", count.toString());
    }
  }

  // 如果阅后即焚模式
  if (config.snapchat_mode) {
    // 删除KV中的记录
    // Remove record before jump to long url
    await LINKS.delete(path)
  }

  // 带上参数部分, 拼装要跳转的最终网址
  // URL to jump finally
  if (params) {
    value = value + params
  }

  // 如果自定义了结果页面
  if (config.result_page) {
    let result_page_html = await fetch(result_html)
    let result_page_html_text = await result_page_html.text()      
    result_page_html_text = result_page_html_text.replace(/{__FINAL_LINK__}/gm, value)
    return new Response(result_page_html_text, {
      headers: response_header,
    })
  } 

  // 以下是不使用自定义结果页面的处理
  // 作为一个短链系统, 需要跳转
  if (config.system_type == "shorturl") {
    return Response.redirect(value, 302)
  } else if (config.system_type == "imghost") {
    // 如果是图床      
    var blob = base64ToBlob(value)
    return new Response(blob, {
      // 图片不能指定content-type为 text/plain
    })
  } else {
    // 如果只是一个单纯的key-value系统, 简单的显示value就行了
    return new Response(value, {
      headers: {
          "Content-type": "text/plain;charset=UTF-8;",
        },
    })
  }
}

addEventListener("fetch", async event => {
  event.respondWith(handleRequest(event.request))
})