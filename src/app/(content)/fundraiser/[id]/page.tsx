import apiRequest from "@/utils/apiRequest";
import type { Metadata } from "next";
import FundraiserPageComp from ".";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const response = await apiRequest("GET", `/fundraise/get-fundraise/${id}`);

  if (!response.success) {
    return {
      title: "Emerg Funds",
      description:
        "Emerg Funds Raising is a dedicated platform designed to help individuals and organizations quickly raise emergency funds for urgent needs. Easily create, share, and support fundraising campaigns for medical emergencies, disaster relief, and other critical situations.",
    };
  }

  const responseData = response.data;

  return {
    title: `${responseData.fundMetaData.title} | Emerg Funds`,
    description: responseData.fundMetaData.description,
    icons: {
      icon: [
        { url: responseData.fundMetaData.imageUrl },
        { url: "https://www.emergfunds.org/logo.jpg" },
      ],
      apple: [{ url: responseData.fundMetaData.imageUrl }],
      other: [{ rel: "mask-icon", url: responseData.fundMetaData.imageUrl }],
    },
    openGraph: {
      title: responseData.fundMetaData.title,
      description: responseData.fundMetaData.description,
      images: responseData.fundMetaData
        ? [responseData.fundMetaData.imageUrl]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: responseData.fundMetaData.title,
      description: responseData.fundMetaData.description,
      images: responseData.fundMetaData
        ? [responseData.fundMetaData.imageUrl]
        : [],
      creator: "@emergfunds_",
    },
  };
}

export default async function FundraiserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FundraiserPageComp fundraiserId={id} />;
}
