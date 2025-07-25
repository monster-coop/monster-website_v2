import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database';
import ProgramDetailClient from './ProgramDetailClient';

type Props = {
  params: Promise<{ slug: string }>
}

type Program = Database['public']['Tables']['programs']['Row'] & {
  program_categories?: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    description: string | null;
  } | null;
  photos?: Array<{
    id: string;
    storage_url: string;
    filename: string;
  }>;
};

// Fetch program data on the server
async function getProgramBySlug(slug: string): Promise<Program | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('programs')
    .select(`
      *,
      program_categories (
        id,
        name,
        slug,
        icon,
        description
      ),
      photos!photos_program_id_fkey (
        id,
        storage_url,
        filename
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  console.log("Query result - data:", data);
  console.log("Query result - error:", error);

  if (error) {
    console.error("Error fetching program by slug:", error);
    return null;
  }

  if (!data) {
    console.log("No data found for slug:", slug);
    return null;
  }

  return data as unknown as Program;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    return {
      title: '프로그램을 찾을 수 없습니다 | 몬스터 협동조합',
      description: '요청하신 프로그램을 찾을 수 없습니다.',
    };
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isEarlyBird = program.early_bird_deadline && new Date(program.early_bird_deadline) > new Date();
  const currentPrice = isEarlyBird ? program.early_bird_price : program.base_price;
  const thumbnailImage = program.photos?.find(photo => photo.id === program.thumbnail)?.storage_url;

  const title = `${program.title} | 몬스터 협동조합`;
  const description = program.description || `${program.title} - ${program.program_categories?.name || ''} 프로그램`;
  
  return {
    title,
    description,
    keywords: [
      program.title,
      program.program_categories?.name || '',
      '몬스터 협동조합',
      '팀프러너',
      '교육',
      '프로그램',
      program.difficulty_level || '',
      ...(program.tags || [])
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://monstercoop.co.kr/programs/${slug}`,
      images: thumbnailImage ? [{
        url: thumbnailImage,
        width: 1200,
        height: 630,
        alt: program.title,
      }] : [],
      siteName: '몬스터 협동조합',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: thumbnailImage ? [thumbnailImage] : [],
    },
    alternates: {
      canonical: `https://monstercoop.co.kr/programs/${slug}`,
    },
    other: {
      'price:amount': (currentPrice || program.base_price).toString(),
      'price:currency': 'KRW',
      'product:availability': program.status === 'open' ? 'in stock' : 'out of stock',
      'article:author': program.instructor_name || '몬스터 협동조합',
      'article:section': program.program_categories?.name || '프로그램',
      'article:tag': program.tags?.join(',') || '',
    },
  };
}

// Note: Removed generateStaticParams to avoid build-time cookie access issues
// The page will be dynamically rendered instead

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  // Add JSON-LD structured data for SEO
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const isEarlyBird = program.early_bird_deadline && new Date(program.early_bird_deadline) > new Date();
  const currentPrice = isEarlyBird ? program.early_bird_price : program.base_price;
  const thumbnailImage = program.photos?.find(photo => photo.id === program.thumbnail)?.storage_url;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationEvent',
    name: program.title,
    description: program.description || program.title,
    ...(thumbnailImage && { image: thumbnailImage }),
    ...(program.start_date && { startDate: program.start_date }),
    ...(program.end_date && { endDate: program.end_date }),
    eventStatus: program.status === 'open' ? 'https://schema.org/EventScheduled' : 'https://schema.org/EventCancelled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(program.location && {
      location: {
        '@type': 'Place',
        name: program.location,
      }
    }),
    organizer: {
      '@type': 'Organization',
      name: '몬스터 협동조합',
      url: 'https://monstercoop.co.kr',
    },
    ...(program.instructor_name && {
      instructor: {
        '@type': 'Person',
        name: program.instructor_name,
        ...(program.instructor_bio && { description: program.instructor_bio }),
      }
    }),
    offers: {
      '@type': 'Offer',
      price: currentPrice || program.base_price,
      priceCurrency: 'KRW',
      availability: program.status === 'open' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://monstercoop.co.kr/programs/${slug}`,
      validFrom: new Date().toISOString(),
      ...(program.start_date && { validThrough: program.start_date }),
    },
    ...(program.max_participants && { maximumAttendeeCapacity: program.max_participants }),
    ...(program.max_participants && program.current_participants && {
      remainingAttendeeCapacity: program.max_participants - program.current_participants
    }),
    ...(program.tags?.length && { keywords: program.tags.join(', ') }),
    ...(program.difficulty_level && { educationalLevel: program.difficulty_level }),
    ...(program.duration_hours && { duration: `PT${program.duration_hours}H` }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        
      />
      <ProgramDetailClient program={program} />
    </>
  );
}