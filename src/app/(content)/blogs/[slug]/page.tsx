
import apiRequest from "@/utils/apiRequest";

import type { Metadata } from "next";
import BlogDetailPagePreview from ".";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const response = await apiRequest("GET", `/blog/${slug}`);

  if (!response.success) {
    return {
      title: "Emerg Funds",
      description:
        "Emerg Funds Raising is a dedicated platform designed to help individuals and organizations quickly raise emergency funds for urgent needs. Easily create, share, and support fundraising campaigns for medical emergencies, disaster relief, and other critical situations.",
    };
  }

  const responseData = response.data;

  return {
    title: `${responseData.title} | Emerg Funds`,
    description: responseData.metaDescription,
    keywords: responseData.tags,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: responseData.featuredImage.file },
        { url: "https://www.emergfunds.org/logo.jpg" },
      ],
      apple: [{ url: responseData.featuredImage.file }],
      other: [{ rel: "mask-icon", url: responseData.featuredImage.file }],
    },
    verification: {
      google: "your-google-site-verification",
    },
    alternates: {
      canonical: "https://www.emergfunds.org",
    },
    metadataBase: new URL("https://www.emergfunds.org"),
    openGraph: {
      title: responseData.title,
      description: responseData.excert,
      images: responseData.featuredImage
        ? [responseData.featuredImage.file]
        : [],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: responseData.title,
      description: responseData.description,
      images: responseData.featuredImage
        ? [responseData.featuredImage.file]
        : [],
      creator: "@emergfunds_",
    },
  };
}


const BlogDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {

  const { slug } = await params;


  return (
    <BlogDetailPagePreview slug={slug} />
  );
};

export default BlogDetailPage;
