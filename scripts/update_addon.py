import json
import os
import re
import time
import urllib.request
from pathlib import Path

# 設定値
API_KEY = os.environ["GEMINI_API_KEY"]
MODEL = "gemini-4-hydrogen"  # 複雑なコード修正が多い場合は gemini-3.1-pro-preview に変更可
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"


def get_latest_bedrock_version() -> str:
    """Minecraft公式APIから最新のBedrockバージョンを取得する"""
    api_url = "https://net-secondary.web.minecraft-services.net/api/v1.0/download/links"
    req = urllib.request.Request(api_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as res:
        raw_data = res.read().decode("utf-8")

    match = re.search(r"bedrock-server-(\d+\.\d+\.\d+)\.\d+\.zip", raw_data)
    if not match:
        raise RuntimeError("最新バージョンの抽出に失敗しました")
    return match.group(1)


def strip_markdown_fences(text: str) -> str:
    """LLMの出力から ```javascript や ``` などのコードブロック記号を除去する"""
    text = text.strip()
    pattern = r"^```[a-zA-Z0-9_-]*\n(.*?)\n```$"
    match = re.match(pattern, text, flags=re.DOTALL)
    if match:
        return match.group(1).strip()
    return text


def call_gemini(prompt: str, is_json: bool) -> str:
    """Gemini APIを呼び出して修正後のテキストを取得する"""
    gen_config = {"temperature": 0.1}
    if is_json:
        gen_config["responseMimeType"] = "application/json"

    payload = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": gen_config,
    }).encode("utf-8")

    req = urllib.request.Request(
        GEMINI_URL,
        data=payload,
        headers={"Content-Type": "application/json"},
    )

    with urllib.request.urlopen(req) as res:
        result = json.loads(res.read().decode("utf-8"))
        return result["candidates"][0]["content"]["parts"][0]["text"].strip()


def update_single_file(file_path: Path, current_ver: str, latest_ver: str) -> None:
    """1ファイルを読み込み、拡張子に応じたプロンプトでGeminiに修正させて上書きする"""
    content = file_path.read_text(encoding="utf-8")
    is_json = file_path.suffix.lower() == ".json"

    if is_json:
        prompt = f"""
Minecraft Bedrockが {current_ver} から {latest_ver} にアップデートされました。
以下の {file_path.as_posix()} について、{latest_ver} 対応に必要な修正を行ってください。
- header.min_engine_version を {latest_ver} に合わせる
- @minecraft/server や @minecraft/server-ui などのモジュールバージョンが古い場合は {latest_ver} で利用可能な安定版に更新する
- 既存のUUIDやロジック構造は絶対に壊さないこと
- 解説は一切不要。修正後の純粋なJSONのみを出力すること

{content}
"""
    else:
        prompt = f"""
Minecraft Bedrockが {current_ver} から {latest_ver} にアップデートされました。
以下のScript APIコード（{file_path.as_posix()}）について、{latest_ver} の @minecraft/server / @minecraft/server-ui で非推奨化・破壊的変更されたAPIがあれば最新の仕様に修正してください。
修正が不要な箇所は元のコードやコメントをそのまま維持してください。
解説文や挨拶は一切出力せず、修正後のコードのみを出力してください。

{content}
"""

    updated_text = call_gemini(prompt, is_json=is_json)

    if is_json:
        # JSONとしてパースできるか検証してから整形保存
        parsed = json.loads(updated_text)
        file_path.write_text(
            json.dumps(parsed, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
    else:
        # コードブロック記号が含まれていれば除去して保存
        clean_code = strip_markdown_fences(updated_text)
        file_path.write_text(clean_code + "\n", encoding="utf-8")


def main() -> None:
    version_file = Path("version.txt")
    current_version = version_file.read_text(encoding="utf-8").strip()
    latest_version = get_latest_bedrock_version()

    if latest_version == current_version:
        print(f"更新なし (現在: {current_version})")
        return

    print(f"新しいバージョンを検知: {current_version} -> {latest_version}")

    # 更新対象ファイルのリストアップ
    target_files: list[Path] = []
    for manifest in [Path("LDNS_cursed_addon_BP/manifest.json"), Path("LDNS_cursed_addon_RP/manifest.json")]:
        if manifest.exists():
            target_files.append(manifest)

    scripts_dir = Path("src")
    if scripts_dir.exists():
        for ext in ("*.js", "*.ts"):
            target_files.extend(sorted(scripts_dir.rglob(ext)))

    # 1ファイルずつ順番に修正（無料枠のレート制限対策で待機時間を挿入）
    for file_path in target_files:
        print(f"更新中: {file_path.as_posix()}")
        update_single_file(file_path, current_version, latest_version)
        time.sleep(4)  # 1分あたりのリクエスト制限（RPM）
