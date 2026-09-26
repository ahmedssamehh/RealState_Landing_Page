import { ListingRoute, listingMetadata, listingStaticParams, type ListingParams } from '@/lib/listingRoute';

/** One page per listing in the rent collection. */
export const dynamicParams = false;

export const generateStaticParams = () => listingStaticParams('rent');

export const generateMetadata = ({ params }: ListingParams) => listingMetadata('rent', params.slug);

export default function Page({ params }: ListingParams) {
  return <ListingRoute collection="rent" slug={params.slug} />;
}
