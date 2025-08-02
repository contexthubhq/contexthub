import React from 'react';

export function useExpansion() {
  const [expandedCatalogs, setExpandedCatalogs] = React.useState<Set<string>>(
    new Set()
  );
  const [expandedSchemas, setExpandedSchemas] = React.useState<Set<string>>(
    new Set()
  );

  const toggleCatalogExpansion = ({ catalogName }: { catalogName: string }) => {
    setExpandedCatalogs((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(catalogName)) {
        newExpanded.delete(catalogName);
      } else {
        newExpanded.add(catalogName);
      }
      return newExpanded;
    });
  };

  const toggleSchemaExpansion = ({
    catalogName,
    schemaName,
  }: {
    catalogName: string;
    schemaName: string;
  }) => {
    const schemaKey = `${catalogName}.${schemaName}`;
    setExpandedSchemas((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(schemaKey)) {
        newExpanded.delete(schemaKey);
      } else {
        newExpanded.add(schemaKey);
      }
      return newExpanded;
    });
  };

  return {
    expandedCatalogs,
    expandedSchemas,
    toggleCatalogExpansion,
    toggleSchemaExpansion,
  };
}
