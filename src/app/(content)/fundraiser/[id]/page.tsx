
import apiRequest from "@/utils/apiRequest";
import type { Metadata } from "next";
import FundraiserPageComp from ".";

type Props = {
  params: {
    id: string;
  };
};


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const response = await apiRequest(
    "GET",
    `/fundraise/get-fundraise/${params.id}`
  );

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
      icon: [{ url: responseData.fundMetaData.imageUrl }],
      apple: [{ url: responseData.fundMetaData.imageUrl }],
      other: [
        { rel: "mask-icon", url: responseData.fundMetaData.imageUrl }
      ]
    },
    openGraph: {
      title: responseData.fundMetaData.title,
      description: responseData.fundMetaData.description,
      images: responseData.fundMetaData
        ? [{ url: responseData.fundMetaData.imageUrl }]
        : []
    },
    twitter: {
      card: "summary_large_image",
      title: responseData.fundMetaData.title,
      description: responseData.fundMetaData.description,
      images: responseData.fundMetaData
        ? [responseData.fundMetaData.imageUrl]
        : []
    }
  };
}


export default function FundraiserPage({ params }: { params: { id: string } }) {
  return (
    <FundraiserPageComp fundraiserId={params.id} />
  )
}
