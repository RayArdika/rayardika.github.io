import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const ALLOWED_FILES: Record<string, string> = {
  profile: "profile.json",
  featuredProjects: "featured-projects.json",
  projects: "projects.json",
  experience: "experience.json",
  certifications: "certifications.json",
  capabilities: "capabilities.json",
  faq: "faq.json",
};

async function readJsonFile(fileName: string) {
  const filePath = path.join(process.cwd(), "content", fileName);
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content);
}

export async function GET() {
  try {
    const [
      profile,
      featuredProjects,
      projects,
      experience,
      certifications,
      capabilities,
      faq,
    ] = await Promise.all([
      readJsonFile("profile.json"),
      readJsonFile("featured-projects.json"),
      readJsonFile("projects.json"),
      readJsonFile("experience.json"),
      readJsonFile("certifications.json"),
      readJsonFile("capabilities.json"),
      readJsonFile("faq.json"),
    ]);

    return NextResponse.json({
      ok: true,
      data: {
        profile,
        featuredProjects,
        projects,
        experience,
        certifications,
        capabilities,
        faq,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Gagal memuat konten CMS" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as { section?: string; data?: unknown };
    const { section, data } = body;

    if (!section || !(section in ALLOWED_FILES) || !data) {
      return NextResponse.json(
        { ok: false, error: "Parameter section atau data tidak valid." },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "content", ALLOWED_FILES[section]);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");

    return NextResponse.json({
      ok: true,
      message: `Bagian ${section} berhasil disimpan ke content/${ALLOWED_FILES[section]}.`,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Gagal menyimpan konten CMS" },
      { status: 500 }
    );
  }
}

