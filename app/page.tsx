import { getPortfolioCMSData } from "@/lib/cms";
import PortfolioClient from "./components/PortfolioClient";

export const dynamic = "force-static";

export default async function HomePage() {
  const cmsData = await getPortfolioCMSData();
  return <PortfolioClient initialData={cmsData} />;
}
