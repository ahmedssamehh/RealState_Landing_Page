import { ListingRoute, listingMetadata, listingStaticParams, type ListingParams } from '@/lib/listingRoute';

/** One page per listing in the sale collection. */
export const dynamicParams = false;

export const generateStaticParams = () => listingStaticParams('sale');

export const generateMetadata = ({ params }: ListingParams) => listingMetadata('sale', params.slug);

export default function Page({ params }: ListingParams) {
  return <ListingRoute collection="sale" slug={params.slug} />;
}
