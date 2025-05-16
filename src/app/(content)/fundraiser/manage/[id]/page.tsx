import ManageFundraiserPage from "."

export default async function ManagePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <ManageFundraiserPage fundraiserId={id} />
  )
}