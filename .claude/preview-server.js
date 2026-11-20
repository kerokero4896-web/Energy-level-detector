// 미리보기 서버: index.html을 claude.ai가 씌우는 것과 같은 뼈대로 감싸서 보여 준다.
// 실행: Claude Code의 preview_start("app-preview") 또는 `node .claude/preview-server.js`
// 주소: http://localhost:8123          → db 없는 미리보기 모드 (기록 저장 안 됨)
//       http://localhost:8123/?mock=1   → 가짜 저장소(mock-db.js)로 저장·불러오기까지 확인
const fs = require("fs");
const http = require("http");
const path = require("path");

const page = path.join(__dirname, "..", "index.html");
const mock = path.join(__dirname, "mock-db.js");
const head =
  '<!doctype html><html><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
  "<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}" +
  "body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>";

http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    if (url.pathname !== "/") {
      res.writeHead(404);
      res.end();
      return;
    }
    const inject = url.searchParams.get("mock") === "1" ? "<script>" + fs.readFileSync(mock, "utf8") + "</script>" : "";
    res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
    res.end(head + inject + "</head><body>" + fs.readFileSync(page, "utf8") + "</body></html>");
  })
  .listen(8123, () => console.log("preview on http://localhost:8123 (가짜 저장소: /?mock=1)"));
