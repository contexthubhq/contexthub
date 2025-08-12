import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CONCEPTS_QUERY_KEY } from './query-keys';
import { Concept } from '@contexthub/core';

async function updateConcept({ concept }: { concept: Concept }) {
  const response = await fetch(`/api/context/concept`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(concept),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update concept.');
  }
  return;
}

export function useUpdateConceptMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ concept }: { concept: Concept }) =>
      updateConcept({ concept }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CONCEPTS_QUERY_KEY],
      });
    },
  });
}
