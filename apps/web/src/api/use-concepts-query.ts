import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { CONCEPTS_QUERY_KEY } from './query-keys';
import { Concept, conceptSchema } from '@contexthub/core';
import z from 'zod';

async function getConcepts(): Promise<Concept[]> {
  const response = await fetch(`/api/context/concept`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch concepts.');
  }
  const schema = z.object({
    concepts: z.array(conceptSchema),
  });

  return schema.parse(data).concepts;
}

export function useConceptsQuery(): UseQueryResult<Concept[], Error> {
  return useQuery({
    queryKey: [CONCEPTS_QUERY_KEY],
    queryFn: () => getConcepts(),
  });
}
