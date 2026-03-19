'use client';

import { useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

// This route is no longer part of the active ETG booking flow.
// The flow goes: /hotels → /hotels/[id] → /hotels/book → /hotels/success
// Redirect anyone who lands here to the hotel details page.
export default function GuestInformationRedirect() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = params?.id as string;
    const qs = searchParams.toString();
    router.replace(`/hotels/${id}${qs ? `?${qs}` : ''}`);
  }, [params, searchParams, router]);

  return null;
}
