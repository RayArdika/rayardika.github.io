import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

async function readEnvLocal(): Promise<Record<string, string>> {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    const raw = await fs.readFile(envPath, "utf8");
    const out: Record<string, string> = {};
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      out[key] = val;
    }
    return out;
  } catch {
    return {};
  }
}

export async function GET(request: NextRequest) {
  const localEnv = await readEnvLocal();
  const clientId = process.env.GITHUB_CLIENT_ID || localEnv.GITHUB_CLIENT_ID || "";
  const repo = process.env.GITHUB_REPO || localEnv.GITHUB_REPO || "rayardika/portofolio-ray2";
  const forceSetup = request.nextUrl.searchParams.get("setup") === "1";

  const origin = request.nextUrl.origin;
  const callbackUrl = `${origin}/api/auth/callback`;

  if (clientId && !forceSetup) {
    const state = Math.random().toString(36).slice(2, 12);
    const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
    githubAuthUrl.searchParams.set("client_id", clientId);
    githubAuthUrl.searchParams.set("redirect_uri", callbackUrl);
    githubAuthUrl.searchParams.set("scope", "repo,user");
    githubAuthUrl.searchParams.set("state", state);
    return NextResponse.redirect(githubAuthUrl.toString());
  }

  const html = `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Konfigurasi Login GitHub OAuth - Decap CMS</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Manrope", sans-serif;
      background: #1F2A2E;
      color: #FFFFFF;
      padding: 24px;
      line-height: 1.5;
    }
    .card {
      max-width: 580px;
      margin: 16px auto;
      background: #FFFFFF;
      color: #1F2A2E;
      border-radius: 20px;
      padding: 28px;
      border-top: 6px solid #C1FF72;
    }
    .badge {
      display: inline-block;
      background: #1F2A2E;
      color: #C1FF72;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 999px;
      margin-bottom: 12px;
    }
    h1 { margin: 0 0 8px; font-size: 22px; font-weight: 800; }
    p { margin: 0 0 16px; color: #4A5459; font-size: 14px; }
    .steps {
      background: #F4F8FA;
      border-radius: 12px;
      padding: 14px 16px;
      margin-bottom: 20px;
      font-size: 13px;
      color: #1F2A2E;
    }
    .steps ol { margin: 6px 0 0; padding-left: 18px; }
    .steps li { margin-bottom: 6px; }
    code {
      background: #1F2A2E;
      color: #C1FF72;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
      word-break: break-all;
    }
    label {
      display: block;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 6px;
    }
    input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #C2CDD2;
      border-radius: 8px;
      font-family: inherit;
      font-size: 14px;
      margin-bottom: 14px;
      color: #1F2A2E;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 8px;
    }
    button, .btn-link {
      appearance: none;
      border: none;
      background: #C1FF72;
      color: #1F2A2E;
      font-weight: 800;
      font-size: 14px;
      padding: 12px 18px;
      border-radius: 999px;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .btn-secondary {
      background: #1F2A2E;
      color: #FFFFFF;
    }
    .status {
      margin-top: 12px;
      font-size: 13px;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">Decap CMS · GitHub OAuth</span>
    <h1>Hubungkan Login GitHub Admin</h1>
    <p>Agar tombol <strong>Login with GitHub</strong> di Decap CMS dapat mengautentikasi akun GitHub Anda, masukkan kredensial GitHub OAuth App di bawah ini (otomatis disimpan ke <code>.env.local</code> dan <code>public/admin/config.yml</code>).</p>
    <div class="steps">
      <strong>Cara mendapatkan Client ID & Secret (1 menit):</strong>
      <ol>
        <li>Buka <a href="https://github.com/settings/developers" target="_blank" rel="noopener noreferrer">GitHub Developer Settings &rarr; OAuth Apps &rarr; New OAuth App</a>.</li>
        <li>Isi <strong>Homepage URL</strong> dengan <code>${origin}</code></li>
        <li>Isi <strong>Authorization callback URL</strong> dengan: <code>${callbackUrl}</code></li>
        <li>Salin <strong>Client ID</strong> dan buat <strong>Client Secret</strong>, lalu tempel di formulir berikut:</li>
      </ol>
    </div>
    <form id="oauthForm">
      <label for="repo">Nama Repository GitHub (username/repo)</label>
      <input id="repo" name="repo" type="text" value="${repo}" placeholder="contoh: rayardika/portofolio-ray2" required />

      <label for="clientId">GitHub OAuth Client ID</label>
      <input id="clientId" name="clientId" type="text" value="${clientId}" placeholder="Ov23li..." required />

      <label for="clientSecret">GitHub OAuth Client Secret</label>
      <input id="clientSecret" name="clientSecret" type="password" placeholder="Masukkan Client Secret dari GitHub" required />

      <div class="actions">
        <button type="submit">Simpan & Lanjutkan Login GitHub</button>
        <a href="/admin/studio" target="_blank" class="btn-link btn-secondary">Buka Studio Editor Lokal (Tanpa OAuth)</a>
      </div>
      <div id="status" class="status" role="status" aria-live="polite"></div>
    </form>
  </div>
  <script>
    const form = document.getElementById("oauthForm");
    const statusEl = document.getElementById("status");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      statusEl.textContent = "Menyimpan konfigurasi OAuth...";
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo: document.getElementById("repo").value.trim(),
          clientId: document.getElementById("clientId").value.trim(),
          clientSecret: document.getElementById("clientSecret").value.trim(),
          origin: window.location.origin
        })
      });
      const data = await res.json();
      if (data.ok) {
        statusEl.textContent = "Tersimpan! Mengalihkan ke halaman otorisasi GitHub...";
        window.location.href = "/api/auth?provider=github";
      } else {
        statusEl.textContent = "Gagal menyimpan: " + (data.error || "Unknown error");
      }
    });
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repo, clientId, clientSecret, origin } = body as {
      repo?: string;
      clientId?: string;
      clientSecret?: string;
      origin?: string;
    };

    if (!repo || !clientId || !clientSecret) {
      return NextResponse.json(
        { ok: false, error: "Repo, Client ID, dan Client Secret wajib diisi." },
        { status: 400 }
      );
    }

    const envPath = path.join(process.cwd(), ".env.local");
    const envContent = [
      `GITHUB_REPO="${repo}"`,
      `GITHUB_CLIENT_ID="${clientId}"`,
      `GITHUB_CLIENT_SECRET="${clientSecret}"`,
      "",
    ].join("\n");
    await fs.writeFile(envPath, envContent, "utf8");

    const configPath = path.join(process.cwd(), "public", "admin", "config.yml");
    let configRaw = await fs.readFile(configPath, "utf8");
    configRaw = configRaw.replace(/repo:\s*.+/, `repo: ${repo}`);
    if (origin) {
      configRaw = configRaw.replace(/base_url:\s*.+/, `base_url: ${origin}`);
    }
    await fs.writeFile(configPath, configRaw, "utf8");

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Gagal menyimpan konfigurasi" },
      { status: 500 }
    );
  }
}

