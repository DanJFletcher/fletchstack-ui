/* eslint-disable sonarjs/no-redundant-optional -- exactOptionalPropertyTypes distinguishes omitted props from explicitly forwarded undefined. */
import { useId, type AriaAttributes } from 'react';

type FieldAccessibilityOptions = {
  id?: string | undefined;
  describedBy?: string | undefined;
  invalid?: AriaAttributes['aria-invalid'];
  error?: string | undefined;
  descriptions: readonly (readonly [suffix: string, content: unknown])[];
  descriptionIds?: readonly string[] | undefined;
};

/**
 * Generate stable control IDs and preserve context before local descriptions and errors.
 **/
export function useFieldAccessibility({
  id,
  describedBy,
  invalid,
  error,
  descriptions,
  descriptionIds = [],
}: FieldAccessibilityOptions): Pick<AriaAttributes, 'aria-describedby' | 'aria-invalid'> & {
  id: string;
} {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const messages = descriptions
    .filter(([, content]) => Boolean(content))
    .map(([suffix]) => `${fieldId}-${suffix}`);

  return {
    id: fieldId,
    'aria-describedby':
      [describedBy, ...descriptionIds, ...messages, error && `${fieldId}-error`]
        .filter(Boolean)
        .join(' ') || undefined,
    'aria-invalid': error ? true : invalid,
  };
}
