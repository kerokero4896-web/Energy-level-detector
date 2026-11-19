# CLAUDE.md

> 이 저장소에서 일하는 Claude가 지킬 규칙.

## 이 저장소는

- 사용자의 "에너지 레벨 감지기" 앱 저장소다. 앱 관련 파일은 여기에 둔다. 사용자의 볼트(GTD-PARA-V)에는 앱 파일을 두지 않는다 (2026-11-19 사용자 확인).
- **공개 저장소**다. 개인 메모·기록·이름·장소·신앙·건강 정보는 넣지 않는다. 질문 문구도 누구에게나 쓸 수 있는 일반적인 표현으로 쓴다.
- 한국어로, 쉬운 말로 설명한다. 사용자는 비개발자다.

## 앱

- `index.html` 하나가 앱 전체다. claude.ai Artifact로 올린다.
  - 주소: https://claude.ai/artifact/LBAuKMrZJCN8rJCEz6Zh85
  - 올리기: Artifact 도구 publish, `file_path` = 이 저장소의 `index.html`, `url` = 위 주소 (다른 대화에서는 먼저 `read`). `capabilities`는 빼서 지금 설정을 그대로 둔다.
  - 지금 설정: `db` (규칙: 루트 read/write = owner, 주인만 읽고 쓰기), `user`
- 기록은 Artifact db의 `days/<YYYY-MM-DD>` 문서다 (하루는 새벽 6시에 바뀐다). 문서 하나에 그날 체크들(`checks` 배열)과 결과(`outcome`: easy / fit / pushed / crashed)가 들어 있다. Claude는 ArtifactData 도구(`list`, `get`)로 읽는다. **기록을 이 저장소에 복사하지 않는다.**
- 점수 기준을 바꾸면 README의 "점수 계산" 표도 같은 PR에서 고친다. 저장된 체크에는 그때의 점수(`score`)와 기준 버전(`v`)이 남으니, 기준을 바꾸면 `index.html`의 `MODEL_V`를 올린다.
- 미리보기: `node .claude/preview-server.js`를 백그라운드로 켜고 http://localhost:8123 을 연다 (db 없는 미리보기 모드). 점수 확인용 함수: `window.__energy.computeResult(...)`.

## 작업 방식

- 브랜치 → PR → 사용자가 PR 화면에서 직접 Merge. `main`에 바로 푸시하지 않는다.
- 노트북 작업 폴더: `C:\Users\kerok\Energy-level-detector`. Obsidian과 상관없는 폴더라 여기서는 브랜치를 바꿔도 된다.
- 커밋 메시지와 PR 설명은 한국어로 짧게.
- 앱을 고치면 같은 `url`로 다시 올리고, PR 설명에 올렸다고 적는다.
- 일을 마치면 볼트의 오늘 루틴화 메모 `claude 자동 저장)` 칸에 한 줄 적는다. 방법은 볼트 CLAUDE.md의 "루틴화 메모"를 따른다.
