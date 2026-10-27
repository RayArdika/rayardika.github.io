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
  const code = request.nextUrl.searchParams.get("code");
  const localEnv = await readEnvLocal();
  const clientId = process.env.GITHUB_CLIENT_ID || localEnv.GITHUB_CLIENT_ID || "";
  const clientSecret = process.env.GITHUB_CLIENT_SECRET || localEnv.GITHUB_CLIENT_SECRET || "";

  if (!code || !clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/api/auth?setup=1", request.nextUrl.origin));
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = (await tokenRes.json()) as { access_token?: string; error?: string; error_description?: string };

    if (!tokenData.access_token) {
      const errMsg = tokenData.error_description || tokenData.error || "Gagal mendapatkan token dari GitHub";
      return new NextResponse(
        `<!doctype html><html lang="id"><body style="font-family:sans-serif;padding:24px;"><h2>Autentikasi GitHub Gagal</h2><p>${errMsg}</p><p><a href="/api/auth?setup=1">Kembali ke Konfigurasi OAuth</a></p></body></html>`,
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    // Decap CMS postMessage handshake protocol for GitHub OAuth popup
    const payload = JSON.stringify({
      token: tokenData.access_token,
      provider: "github",
    });

    const html = `<!doctype html>
<html lang="id">
<head><meta charset="utf-8"><title>Otorisasi GitHub Berhasil</title></head>
<body>
  <p style="font-family:sans-serif;padding:20px;">Menyambungkan akun GitHub ke Decap CMS...</p>
  <script>
    (function() {
      function receiveMessage(e) {
        window.opener.postMessage(
          'authorization:github:success:${payload}',
          e.origin
        );
        window.removeEventListener("message", receiveMessage, false);
      }
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
    })();
  </script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    return new NextResponse(
      `<!doctype html><html lang="id"><body><p>Error: ${error instanceof Error ? error.message : "OAuth error"}</p></body></html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" }, status: 500 }
    );
  }
}

